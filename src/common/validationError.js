var concatErrors = function (array) {
    if (array.length == 1) {
        return array[0].errors;
    }
    var errors = [];
    array.forEach(function (err) {
        errors.push.apply(errors, err.errors);
    });
    return errors;
};

var ValidationError = function (firstParam) {
    if (Array.isArray(firstParam)) {
        this.errors = concatErrors(firstParam);
    } else if (typeof firstParam == "string") {
        this.errors = [];
        this.addError.apply(this, arguments);
    } else if (typeof firstParam == "object") {
        this.errors = firstParam.errors;
    }
};

ValidationError.prototype.addError = function (id, value, args, path) {
    this.errors.push({
        id : id,
        //value : value,
        args : args || [],
        path : (path ? path.slice(0) : [])
    });
};

ValidationError.prototype.prependPath = function (prependPath) {
    var args = arguments;
    this.errors.forEach(function (error) {
        var path = error.path;
        path.unshift.apply(path, args);
    });
};

module.exports = ValidationError;
