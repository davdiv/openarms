var v = require("../validator");

var notZero = function (value) {
    if (value === 0) {
        throw new Error("Useless line");
    }
};

module.exports = v.validator(v.object({
    days : [ v.mandatory, v.array([ v.mandatory, v.object({
        date : [ v.mandatory, v.date, v.pastDate ],
        amount : [ v.number ],
        personInCharge : v.id,
        team : v.array([ v.mandatory, v.id ]),
        lines : [ v.mandatory, v.array([ v.mandatory, v.object({
            item : [ v.mandatory, v.string ],
            amount : [ v.mandatory, v.number, notZero ]
        }) ]) ]
    }) ]) ],
    sumAmount : v.number,
    realAmount : v.number,
    countedBy : v.id,
    tags : v.array([ v.mandatory, v.string, v.minLength(1) ]),
    notes : v.string,
    lastChangeTimestamp : v.date,
    id : v.id
}));
