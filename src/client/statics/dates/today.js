module.exports = function () {
    var res = new Date();
    return new Date(res.getFullYear(), res.getMonth(), res.getDate());
};