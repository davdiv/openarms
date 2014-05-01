var isNotMetaData = require("./serialization").isNotMetaData;

var forAllKeys = function(object, fn) {
    Object.keys(object).filter(isNotMetaData).forEach(fn);
}

module.exports = function(dest, src) {
    forAllKeys(dest, function(key) {
        if (!src.hasOwnProperty(key)) {
            delete dest[key];
        }
    });
    forAllKeys(src, function(key) {
        dest[key] = src[key];
    });
};