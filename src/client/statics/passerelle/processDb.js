var sqlite = require("sqlite");

var forEach = require("../utils/forEach");

var checkNull = function (value) {
    return (value == "(null)" ? null : value);
};

var arrayToJson = function (array) {
    var res = {};
    forEach(array, function (item) {
        var column = item.column;
        if (res.hasOwnProperty(column)) {
            throw new Exception("Duplicate column: " + column);
        }
        res[column] = checkNull(item.value);
    })
    return res;
};

var convertRegistration = function (registration) {
    return {
        people : []
    };
};

var processRegistrations = function (array) {
    var map = {};
    var resArray = array.map(function (item) {
        var convertedRegistration = convertRegistration(item);
        var id = item.Id;
        if (map.hasOwnProperty(id)) {
            throw new Exception("Duplicate id: " + id);
        }
        map[id] = convertedRegistration;
        return convertedRegistration;
    });
    return {
        array: resArray,
        map: map
    };
};

var sexes = {
    "feminin" : "female",
    "masculin" : "male"
};

var dateRegExp = /^([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})$/;
var convertBirthDate = function (strDate) {
    var match = dateRegExp.exec(strDate);
    if (match) {
        return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]), parseInt(match[4]), parseInt(match[5]),
            parseInt(match[6]))
    } else {
        throw new Exception("Unrecognised date: " + strDate);
    }
};

var convertPerson = function (person) {
    return {
        firstName : person.Prenom,
        lastName : person.Nom,
        sex : sexes[person.Sexe.toLowerCase()],
        birthDate : convertBirthDate(person.DateNaissance)
    };
};

var processPeople = function (dbPeople, dbRegistrationsMap) {
    forEach(dbPeople, function (person) {
        var convertedPerson = convertPerson(person);
        var registrationId = person.Beneficiaire_id;
        var registration = dbRegistrationsMap[registrationId];
        if (!registration) {
            throw new Exception("Missing registration: " + registrationId);
        }
        registration.people.push(convertedPerson);
    });
};

module.exports = function (file) {
    var db = sqlite.open(file);
    var dbRegistrations = db.exec("SELECT * FROM Beneficiaire").map(arrayToJson);
    var dbPeople = db.exec("SELECT * FROM Personne").map(arrayToJson);
    db.close();
    var res = processRegistrations(dbRegistrations);
    processPeople(dbPeople, res.map);
    return res.array;
};
