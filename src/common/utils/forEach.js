module.exports = function (array, fn, scope) {
    if (array && array.forEach) {
        array.forEach(fn, scope);
    }
};