var datePattern = /^([0-9]+)[-.\/ ]([0-9]+)[-.\/ ]([0-9]{4})$/;

module.exports = function (date) {
    var match = datePattern.exec(date);
    if (!match) {
        return null;
    }
    var day = parseInt(match[1], 10);
    var month = parseInt(match[2], 10);
    var year = parseInt(match[3], 10);
    month--;
    var res = new Date(year, month, day);
    if (res.getDate() != day || res.getMonth() != month || res.getFullYear() != year) {
        return null;
    }
    return res;
};
