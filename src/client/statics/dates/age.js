module.exports = function (date, today) {
    if (!today) {
        today = new Date();
    }
    var todayYear = today.getFullYear();
    var year = date.getFullYear();
    var todayMonth = today.getMonth();
    var month = date.getMonth();

    if (todayMonth < month) {
        return todayYear - year - 1;
    } else if (todayMonth > month) {
        return todayYear - year;
    } else {
        var todayDay = today.getDate();
        var day = date.getDate();
        if (todayDay < day) {
            return todayYear - year - 1;
        } else {
            return todayYear - year;
        }
    }
};
