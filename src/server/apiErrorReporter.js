var ValidationError = require("../common/validation/utils/validationError");
var NotFoundError = require("../common/notFoundError");
var SimpleError = require("../common/simpleError");

module.exports = function (err, req, res, next) {
    if (err instanceof ValidationError) {
        res.status(400).json(err);
    } else if (err instanceof NotFoundError) {
        res.status(404).json(err);
    } else if (err instanceof SimpleError) {
        res.status(500).json(err);
    } else {
        next(err);
    }
};
