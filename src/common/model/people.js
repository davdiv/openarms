var v = require("../validator");

var atLeastOneName = function (person) {
    if (!person.firstName && !person.lastName && !person.familyName) {
        throw new Error("There must be at least one name.");
    }
};

module.exports = v.validator([ v.mandatory, v.object({
    firstName : v.string,
    lastName : v.string,
    familyName : v.string,
    sex : v.enumValue([ "male", "female" ]),
    maritalStatus : v.enumValue(require("../maritalStatuses")),
    birthDate : [ v.date, v.pastDate ],
    birthCity : v.string,
    birthCountry : v.string,
    nationalities : v.array([ v.mandatory, v.string, v.minLength(1) ]),
    contactDetails : v.array([ v.mandatory, v.object({
        type : v.enumValue([ "email", "phone" ]),
        value : [ v.mandatory, v.string ]
    }) ]),
    lastChangeTimestamp : v.date,
    id : v.id
}), atLeastOneName ]);
