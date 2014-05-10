var jsonStringify = JSON.stringify;
var jsonParse = JSON.parse;
var ValidationError = require("./validationError");
var NotFoundError = require("./notFoundError");

// so that the value is the object in the replacer:
Date.prototype.toJSON = null;

var isServer = global.process && global.process.versions && global.process.versions.node;
// Use UTC dates on the server, local dates on the client
var createDate = isServer ? function (value) {
    var date = value.$date;
    if (value.length === 3) {
        return new Date(Date.UTC(date[0], date[1] - 1, date[2]));
    } else {
        return new Date(date);
    }
} : function (value) {
    var date = value.$date;
    if (value.length === 3) {
        return new Date(date[0], date[1] - 1, date[2]);
    } else {
        return new Date(date);
    }
};
var getDateReplacement = isServer ? function (value) {
    if (value.getUTCHours() === 0 && value.getUTCMinutes() === 0 && value.getUTCSeconds() === 0 &&
        value.getUTCMilliseconds() === 0) {
        // this is a date
        return {
            $date : [ value.getUTCFullYear(), value.getUTCMonth() + 1, value.getUTCDate() ]
        };
    } else {
        // this is a timestamp
        return {
            $date : value.getTime()
        };
    }

}
    : function (value) {
        if (value.getHours() === 0 && value.getMinutes() === 0 && value.getSeconds() === 0 &&
            value.getMilliseconds() === 0) {
            // this is a date
            return {
                $date : [ value.getFullYear(), value.getMonth() + 1, value.getDate() ]
            };
        } else {
            // this is a timestamp
            return {
                $date : value.getTime()
            };
        }
    };

var isMetaData = function (key) {
    return /^\+/.test(key);
};

var isNotMetaData = function (key) {
    return !isMetaData(key);
};

var replacer = function (key, value) {
    if (isMetaData(key)) {
        return undefined;
    }
    if (value instanceof Date) {
        return getDateReplacement(value);
    }
    if (value instanceof ValidationError) {
        return {
            $validationErrors : value.errors
        };
    }
    if (value instanceof NotFoundError) {
        return {
            $notFoundError : true
        };
    }
    return value;
};

var reviver = function (key, value) {
    if (value && value.$date) {
        return createDate(value);
    }
    if (value && value.$validationErrors) {
        return new ValidationError({
            errors : value.$validationErrors
        });
    }
    if (value && value.$notFoundError) {
        return new NotFoundError();
    }
    return value;
};

var stringify = function (object) {
    return jsonStringify(object, replacer);
};

var parse = function (string) {
    return jsonParse(string, reviver);
};

var clone = function (object) {
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