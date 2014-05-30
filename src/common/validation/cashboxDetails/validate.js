var v = require("../utils/validators");

var coinsOrBanknotes = [ v.mandatory, v.array([ v.mandatory, v.object({
    unitValue : [ v.mandatory, v.number ],
    number : [ v.mandatory, v.number ],
    total : v.number
}) ]) ];

var checks = v.array([ v.mandatory, v.object({
    checkBank : v.string,
    checkNumber : v.string,
    checkDate : [ v.date, v.pastDate ],
    total : v.number
}) ]);

var total = [ v.mandatory, v.object({
    number : [ v.mandatory, v.number ],
    total : [ v.mandatory, v.number ]
}) ];

module.exports = v.object({
    coins : coinsOrBanknotes,
    banknotes : coinsOrBanknotes,
    checks : checks,
    total : v.object({
        coins : total,
        banknotes : total,
        checks : total,
        general : total
    })
});
