var f2 = function (value) {
    if (value < 10) {
        return "0" + value;
    } else {
        return "" + value;
    }
};

exports.date = function (jsDate) {
    if (!jsDate) {
        return "";
    }
    var res = [ f2(jsDate.getDate()), "/", f2(1 + jsDate.getMonth()), "/", jsDate.getFullYear() ];
    return res.join("");
};

exports.timestamp = function (jsDate) {
    if (!jsDate) {
        return "";
    }
    var res = [
        f2(jsDate.getDate()),
        "/",
        f2(1 + jsDate.getMonth()),
        "/",
        jsDate.getFullYear(),
        " ",
        f2(jsDate.getHours()),
        ":",
        f2(1 + jsDate.getMinutes()),
        ":",
        f2(jsDate.getSeconds()) ];
    return res.join("");
};
