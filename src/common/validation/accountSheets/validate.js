var v = require("../utils/validators");
var cashboxDetails = require("../cashboxDetails/validate");

var notZero = function (value) {
    if (value === 0) {
        throw new v.ValidationError("notZero", value);
    }
};

module.exports = v.validator([ v.mandatory, v.object({
    days : [ v.mandatory, v.array([ v.mandatory, v.object({
        date : [ v.mandatory, v.date, v.pastDate ],
        amount : [ v.number ],
        personInCharge : v.id,
        team : [ v.removeStringDuplicates, v.array([ v.mandatory, v.id ]) ],
        lines : [ v.mandatory, v.array([ v.mandatory, v.object({
            item : [ v.mandatory, v.string ],
            amount : [ v.mandatory, v.number, notZero ]
        }) ]) ]
    }) ]) ],
    sumAmount : v.number,
    realAmount : v.number,
    realAmountDetails : cashboxDetails,
    countedBy : v.id,
    tags : [ v.removeStringDuplicates, v.array([ v.mandatory, v.string, v.minLength(1) ]) ],
    notes : v.string,
    lastChangeTimestamp : v.date,
    id : v.id
}) ]);
