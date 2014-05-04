module.exports = function (data) {
    var allDays = 0;
    data.days.forEach(function (day) {
        var allLines = 0;
        day.lines.forEach(function (line) {
            allLines += line.amount;
        });
        day.amount = allLines;
        allDays += allLines;
    });
    data.sumAmount = allDays;
};
