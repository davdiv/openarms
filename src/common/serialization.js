// so that the value is the object in the replacer:
Date.prototype.toJSON = null;

var replacer = function (key, value) {
    if (/^\+/.test(key)) {
        return undefined;
    }
    if (/date$/i.test(key) && value) {
        return [ value.getFullYear(), value.getMonth() + 1, value.getDate() ];
    }
    if (/timestamp$/i.test(key) && value) {
        return value.getTime();
    }
    return value;
};

var reviver = function (key, value) {
    if (/date$/i.test(key) && value) {
        return new Date(value[0], value[1] - 1, value[2]);
    }
    if (/timestamp$/i.test(key) && value) {
        return new Date(value);
    }
    return value;
};

var stringify = function (object) {
    return JSON.stringify(object, replacer);
};

var parse = function (string) {
    return JSON.parse(string, reviver);
};

var clone = function (object) {
    var serialized = stringify(object);
    return parse(serialized);
};

module.exports = {
    stringify : stringify,
    parse : parse,
    clone : clone
};