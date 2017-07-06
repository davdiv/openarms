var mongodb = require("mongodb");

module.exports = function(dbUrl) {
    return mongodb.MongoClient.connect(dbUrl, {
        w : 1
    });
};
