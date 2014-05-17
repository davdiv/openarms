module.exports = function(value) {
    if (isNaN(value)) {
        return "";
    }
    var negative = value < 0;
    if (negative) {
        value = -value;
    }
    var noDot = Math.round(value * 100);
    var afterDot = noDot % 100;
    var beforeDot = (noDot - afterDot) / 100;
    var afterDotStr = afterDot + "";
    if (afterDotStr.length == 1) {
        afterDotStr = "0" + afterDotStr;
    }
    return (negative ? "-" : "") + beforeDot + "." + afterDotStr + " €";
};
