var emptyFunction = function () {};

module.exports = function(db) {
    return db.dropDatabase().then(emptyFunction, emptyFunction);
};
