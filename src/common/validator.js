var notMetaData = require("./serialization").isNotMetaData;
var forEach = require("./utils/forEach");

var arrayToKeys = function (array) {
    var res = {};
    forEach(array, function (key) {
        res[key] = 1;
    });
    return res;
};

var callValidators = function (validators) {
    if (typeof validators == "function") {
        return validators;
    } else if (Array.isArray(validators)) {
        return function (value) {
            validators.forEach(function (fn) {
                fn(value);
            });
        };
    }
};

exports.validator = callValidators;

exports.object = function (config) {
    var configKeys = Object.keys(config);
    return function (value) {
        if (value != null) {
            if (typeof value != "object") {
                throw new Error("Expected an object");
            }
            var remainingProperties = arrayToKeys(Object.keys(value).filter(notMetaData));
            configKeys.forEach(function (key) {
                var valueKey = value[key];
                if ((valueKey == null && remainingProperties[key] == 1) ||
                    (typeof valueKey === "string" || Array.isArray(valueKey)) && valueKey.length == 0) {
                    // do not keep empty values, erase the property instead
                    valueKey = null;
                    delete value[key];
                }
                try {
                    callValidators(config[key])(valueKey);
                } catch (e) {
                    throw new Error(key + ":" + e);
                }
                delete remainingProperties[key];
            });
            remainingProperties = Object.keys(remainingProperties);
            if (remainingProperties.length > 0) {
                throw new Error("Invalid propertie(s): " + remainingProperties.join(','));
            }
        }
    };
};

exports.array = function (config) {
    var validator = callValidators(config);
    return function (value) {
        if (value && !Array.isArray(value)) {
            throw new Error("Expected an array");
        }
        forEach(value, validator);
    }
};

exports.minLength = function (minLength) {
    return function (value) {
        if (value != null && value.length < minLength) {
            throw new Error("Size of element is not sufficient.");
        }
    }
};

exports.string = function (value) {
    if (value != null && typeof value !== "string") {
        throw new Error("Expected a string");
    }
};

exports.number = function (value) {
    if (value != null && typeof value !== "number") {
        throw new Error("Expected a number");
    }
};

exports.date = function (value) {
    if (value != null && !(value instanceof Date)) {
        throw new Error("Expected a date");
    }
};

exports.pastDate = function (value) {
    if (value != null && value.getTime() > Date.now()) {
        throw new Error("Expected a past date");
    }
};

exports.mandatory = function (value) {
    if (value == null) {
        throw new Error("Expected a value");
    }
};

exports.enumValue = function (values) {
    if (Array.isArray(values)) {
        values = arrayToKeys(values);
    }
    return function (value) {
        if (value != null) {
            if (typeof value != "string" || values[value] == null) {
                throw new Error("Invalid enum value: " + value);
            }
        }
    }
};

var idRegex = /^[0-9a-f]{24}$/;
exports.id = function (value) {
    if (value != null && (typeof value != "string" || !idRegex.test(value))) {
        throw new Error("Invalid id");
    }
}
