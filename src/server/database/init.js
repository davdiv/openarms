var connectDatabase = require("./connectDatabase");
var emptyDatabase = require("./emptyDatabase");

var versionCheck = {
    application : 'assocomptes',
    dbVersion : 'DB-0'
};

module.exports = function (config) {
    var db = null;

    function start () {
        console.log('Connecting to database at %s', config["db-url"]);
        return connectDatabase(config["db-url"]).then(setDbAndContinue);
    }

    function setDbAndContinue (dbRef) {
        console.log("Successfully connected to database");
        db = dbRef;
        if (config['db-empty']) {
            console.log('Erasing the content of the database');
            return emptyDatabase(db).then(initialize);
        }
        return db.collection('general').findOne({}).then(
            function (version) {
                if (!version) {
                    return initialize();
                } else if (version.application != versionCheck.application) {
                    throw new Error('The database is not empty and does not seem to contain data for ' +
                        versionCheck.application + '.');
                } else if (version.dbVersion != versionCheck.dbVersion) {
                    throw new Error('Database version check failed. Expected version: ' + versionCheck.dbVersion +
                        ', found version: ' + version.dbVersion);
                }
                return;
            });
    }

    function initialize () {
        console.log('Initializing the database');
        return db.collection('general').insert({
            _id : 0,
            application : versionCheck.application,
            dbVersion : versionCheck.dbVersion,
            date : new Date().getTime()
        });
    }

    function returnDb () {
        return db;
    }

    function createRegistrationsPeopleIndex () {
        return db.collection("registrations").ensureIndex({
            "current.people" : 1
        }, {
            unique : true,
            sparse : true
        });
    }

    function createIndexes () {
        console.log("Adding indexes (if needed)");
        return createRegistrationsPeopleIndex();
    }

    return start().then(createIndexes).then(returnDb);
};
