var Q = require('q');
var mongodb = require("mongodb");

module.exports = function(dbUrl) {
    return Q.ninvoke(mongodb.Db, 'connect', dbUrl, {
        db : {
            w : 1
        }
    });
};
