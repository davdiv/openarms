var forEach = require("../../../utils/forEach");

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
};
