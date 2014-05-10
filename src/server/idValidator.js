var v = require("../common/validator");

module.exports = function (req, res, next, id) {
    v.id(id);
    next();
};