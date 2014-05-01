module.exports = function(value) {
    if (isNaN(value)) {
        return "";
    }
    var noDot = Math.round(value * 100);
    var afterDot = noDot % 100;
    var beforeDot = (noDot - afterDot) / 100;
    var afterDotStr = Math.abs(afterDot) + "";
    if (afterDotStr.length == 1) {
        afterDotStr = "0" + afterDotStr;
    }
    return beforeDot + "." + afterDotStr + " €";
};
