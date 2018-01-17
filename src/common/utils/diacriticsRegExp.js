var diacritics = require("diacritics");

var allCharsMap = diacritics.diacriticsMap;
var baseCharsMap = {};

diacritics.replacementList.forEach(function (item) {
    baseCharsMap[item.base] = "[" + item.base + item.chars + "]";
});

var replaceSpecialChar = function (text) {
    var code = text.charCodeAt(0);
    return code > 16 && code < 256 ? "\\x" + code.toString(16) : text;
};

module.exports = function (text) {
    return text.replace(/./g, function (match) {
        var result = match;
        result = allCharsMap[result] || result; // removes accents
        result = baseCharsMap[result] || replaceSpecialChar(result);
        return result;
    });
};
