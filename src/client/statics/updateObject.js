var notMetaData = function(key) {
    return !(/^\+/.test(key));
}

var forAllKeys = function(object, fn) {
    Object.keys(object).filter(notMetaData).forEach(fn);
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