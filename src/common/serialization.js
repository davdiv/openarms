var jsonStringify = JSON.stringify;
var jsonParse = JSON.parse;

// so that the value is the object in the replacer:
Date.prototype.toJSON = null;

var isServer = global.process && global.process.versions && global.process.versions.node;
// Use UTC dates on the server, local dates on the client
var createDate = isServer ? function(value) {
    return new Date(Date.UTC(value[0], value[1] - 1, value[2]));
} : function(value) {
    return new Date(value[0], value[1] - 1, value[2]);
};
var getDateReplacement = isServer ? function(value) {
    return [ value.getUTCFullYear(), value.getUTCMonth() + 1, value.getUTCDate() ];
} : function(value) {
    return [ value.getFullYear(), value.getMonth() + 1, value.getDate() ];
};

var isMetaData = function(key) {
    return /^\+/.test(key);
};

var isNotMetaData = function(key) {
    return !isMetaData(key);
};

var replacer = function(key, value) {
    if (isMetaData(key)) {
        return undefined;
    }
    if (/date$/i.test(key) && value) {
        return getDateReplacement(value);
    }
    if (/timestamp$/i.test(key) && value) {
        return value.getTime();
    }
    return value;
};

var reviver = function(key, value) {
    if (/date$/i.test(key) && value) {
        return createDate(value);
    }
    if (/timestamp$/i.test(key) && value) {
        return new Date(value);
    }
    return value;
};

var stringify = function(object) {
    return jsonStringify(object, replacer);
};

var parse = function(string) {
    return jsonParse(string, reviver);
};

var clone = function(object) {
    var serialized = stringify(object);
    return parse(serialized);
};

module.exports = {
    stringify : stringify,
    parse : parse,
    replacer : replacer,
    reviver : reviver,
    clone : clone,
    isMetaData : isMetaData,
    isNotMetaData : isNotMetaData
};