var v = require("../common/validation/utils/validators");

module.exports = function (req, res, next, id) {
    v.id(id);
    next();
};