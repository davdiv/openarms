var emptyFunction = function () {};
var collections = require("./collections");

module.exports = function(db) {
    function dropCollection(name) {
        // Passing 2 empty functions so that there is no return value and no
        // error.
        return db.dropCollection(name).then(emptyFunction, emptyFunction);
    }
    return Promise.all(collections.map(dropCollection));
};
