var rawBody = require("raw-body");
var serialization = require('../common/serialization');

module.exports = function(req, res, next) {
    rawBody(req, {
        length : req.headers["content-length"],
        limit : "1mb",
        encoding : "utf8"
    }, function(err, string) {
        if (err) {
            return next(err);
        }
        req.body = serialization.parse(string);
        next();
    })
};
