var isPromise = require("./isPromise");

module.exports = function(object, propertyName, errorProperty) {
    var value = object[propertyName];
    if (errorProperty) {
        object[errorProperty] = null;
    }
    if (isPromise(value)) {
        value.then(function(resolvedValue) {
            var newValue = object[propertyName];
            if (newValue == value) {
                object[propertyName] = resolvedValue;
                object[errorProperty] = null;
            }
        }, errorProperty ? function(error) {
            object[errorProperty] = error;
        } : null);
    }
};
