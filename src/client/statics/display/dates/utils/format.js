var f2 = function (value) {
    if (value < 10) {
        return "0" + value;
    } else {
        return "" + value;
    }
};

module.exports = function (jsDate) {
    if (!jsDate) {
        return "";
    }
    var res = [ f2(jsDate.getDate()), "/", f2(1 + jsDate.getMonth()), "/", jsDate.getFullYear() ];
    return res.join("");
};
