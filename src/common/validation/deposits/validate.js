var v = require("../utils/validators");
var cashboxDetails = require("../cashboxDetails/validate");

var notZero = function (value) {
    if (value === 0) {
        throw new v.ValidationError("notZero", value);
    }
};

module.exports = v.validator([ v.mandatory, v.object({
    depositNumber : [ v.mandatory, v.string, v.minLength(1) ],
    date : [ v.mandatory, v.date, v.pastDate ],
    declaredAmount : [ v.mandatory, v.number, notZero ],
    declaredAmountDetails : cashboxDetails,
    bankDate : [ v.date, v.pastDate ],
    bankAdjustment : v.object({
        amount: [ v.mandatory, v.number, notZero ],
        date: [ v.mandatory, v.date, v.pastDate ]
    }),
    finalAmount : v.number,
    tags : [ v.removeStringDuplicates, v.array([ v.mandatory, v.string, v.minLength(1) ]) ],
    notes : v.string,
    lastChangeTimestamp : v.date,
    id : v.id
}) ]);
