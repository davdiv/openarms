var ValidationError = require("../common/validationError");
var NotFoundError = require("../common/notFoundError");

module.exports = function (err, req, res, next) {
    if (err instanceof ValidationError) {
        res.json(400, err);
    } else if (err instanceof NotFoundError) {
        res.json(404, err);
    } else {
        next(err);
    }
};