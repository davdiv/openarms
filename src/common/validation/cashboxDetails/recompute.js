var forEach = require("../../utils/forEach");

var computeTotal = function (objects) {
    var number = 0;
    var total = 0;
    forEach(objects, function (curObject) {
        if (typeof curObject.unitValue == "number") {
            curObject.total = curObject.number * curObject.unitValue;
        }
        if (typeof curObject.number == "number") {
            number += curObject.number;
        } else {
            // this is for checks
            number += 1;
        }
        total += curObject.total;

    });
    return {
        number : number,
        total : total
    };
};

module.exports = function (data) {
    var totalCoins = computeTotal(data.coins);
    var totalBanknotes = computeTotal(data.banknotes);
    var totalChecks = computeTotal(data.checks);
    var general = computeTotal([ totalCoins, totalBanknotes, totalChecks ]);
    data.total = {
        coins : totalCoins,
        banknotes : totalBanknotes,
        checks : totalChecks,
        general : general
    };
};
