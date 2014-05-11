var notMetaData = require("./serialization").isNotMetaData;
var forEach = require("./utils/forEach");

var ValidationError = require("./validationError");

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
            var errors = [];
            validators.forEach(function (fn) {
                try {
                    fn(value);
                } catch (e) {
                    if (!(e instanceof ValidationError)) {
                        throw e;
                    }
                    errors.push(e);
                }
            });
            if (errors.length > 0) {
                throw new ValidationError(errors);
            }
        };
    }
};

exports.ValidationError = ValidationError;

exports.validator = callValidators;

exports.object = function (config) {
    var configKeys = Object.keys(config);
    return function (value) {
        if (value != null) {
            if (typeof value != "object") {
                throw new ValidationError("object", value);
            }
            var errors = [];
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
                    if (!(e instanceof ValidationError)) {
                        throw e;
                    }
                    e.prependPath(key);
                    errors.push(e);
                }
                delete remainingProperties[key];
            });
            remainingProperties = Object.keys(remainingProperties);
            if (remainingProperties.length > 0) {
                errors.push(new ValidationError("object.extra-properties", value, [ remainingProperties ]));
            }
            if (errors.length > 0) {
                throw new ValidationError(errors);
            }
        }
    };
};

exports.array = function (config) {
    var validator = callValidators(config);
    return function (value) {
        if (value && !Array.isArray(value)) {
            throw new ValidationError("array", value);
        }
        var errors = [];
        forEach(value, function (value, index) {
            try {
                validator(value);
            } catch (e) {
                if (!(e instanceof ValidationError)) {
                    throw e;
                }
                e.prependPath(index);
                errors.push(e);
            }
        });
        if (errors.length > 0) {
            throw new ValidationError(errors);
        }
    }
};

exports.removeStringDuplicates = function (value) {
    if (value == null || !Array.isArray(value)) {
        return;
    }
    var keys = {};
    for (var i = 0, l = value.length; i < l; i++) {
        var curItem = value[i];
        if (typeof curItem == "string") {
            if (keys[curItem] == 1) {
                value.splice(i, 1);
                i--;
            } else {
                keys[curItem] = 1;
            }
        }
    }
};

exports.minLength = function (minLength) {
    return function (value) {
        if (value != null && value.length < minLength) {
            throw new ValidationError("minLength", value, [ value.length, minLength ]);
        }
    }
};

exports.string = function (value) {
    if (value != null && typeof value !== "string") {
        throw new ValidationError("string", value);
    }
};

exports.number = function (value) {
    if (value != null && typeof value !== "number") {
        throw new ValidationError("number", value);
    }
};

exports.date = function (value) {
    if (value != null && !(value instanceof Date)) {
        throw new ValidationError("date", value);
    }
};

exports.pastDate = function (value) {
    if (value != null && value instanceof Date && value.getTime() > Date.now()) {
        throw new ValidationError("pastDate", value);
    }
};

exports.mandatory = function (value) {
    if (value == null) {
        throw new ValidationError("mandatory", value);
    }
};

exports.enumValue = function (values) {
    if (Array.isArray(values)) {
        values = arrayToKeys(values);
    }
    return function (value) {
        if (value != null) {
            if (typeof value != "string" || values[value] == null) {
                throw new ValidationError("enumValue", value);
            }
        }
    }
};

var idRegex = /^[0-9a-f]{24}$/;
exports.id = function (value) {
    if (value != null && (typeof value != "string" || !idRegex.test(value))) {
        throw new ValidationError("id", value);
    }
}
