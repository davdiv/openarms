var v = require("./utils/validators");

module.exports = v.validator([ v.mandatory, v.object({
    people : [ v.mandatory, v.removeStringDuplicates, v.array([ v.mandatory, v.id ]) ],
    lastChangeTimestamp : v.date,
    id : v.id
}) ]);
