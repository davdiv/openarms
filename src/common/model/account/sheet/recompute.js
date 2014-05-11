var forEach = require("../../../utils/forEach");
var computeCashboxDetails = require("../cashboxDetails/recompute");

module.exports = function (data) {
    var allDays = 0;
    forEach(data.days, function (day) {
        var allLines = 0;
        if (day.lines) {
            day.lines.forEach(function (line) {
                allLines += line.amount;
            });
        }
        day.amount = allLines;
        allDays += allLines;
    });
    data.sumAmount = allDays;
    var realAmountDetails = data.realAmountDetails;
    if (realAmountDetails) {
        computeCashboxDetails(realAmountDetails);
        data.realAmount = realAmountDetails.total.general.total;
    }
};
