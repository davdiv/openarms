var rawBody = require("raw-body");
var serialization = require('../common/serialization');

module.exports = function (req, res, next) {
    rawBody(req, {
        length : req.headers["content-length"],
        limit : "1mb",
        encoding : "utf8"
    }, function (err, string) {
        if (err) {
            return next(err);
        }
        try {
            req.body = serialization.parse(string);
            next();
        } catch (err) {
            next(err);
        }
    })
};
