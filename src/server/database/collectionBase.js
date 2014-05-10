var klass = require("hashspace/hsp/klass");
var ObjectID = require("mongodb").ObjectID;
var Q = require("q");
var NotFoundError = require("../../common/notFoundError");

module.exports = klass({
    $constructor : function (collection) {
        this.collection = collection;
    },

    processFromDB : function (doc) {
        var res = doc.current;
        res.id = doc._id.toString();
        return res;
    },

    processToDB : function (doc) {
        delete doc.id;
        return {
            current : doc
        };
    },

    insert : function (doc) {
        var self = this;
        var processedDoc = self.processToDB(doc);
        processedDoc.current.lastChangeTimestamp = new Date();
        return Q.ninvoke(this.collection, "insert", [ processedDoc ]).then(function (array) {
            return self.processFromDB(array[0]);
        });
    },

    save : function (doc) {
        var self = this;
        var id = new ObjectID(doc.id);
        var processedDoc = self.processToDB(doc);
        var current = processedDoc.current;
        var lastChangeTimestamp = current.lastChangeTimestamp;
        current.lastChangeTimestamp = new Date();
        return Q.ninvoke(this.collection, "update", {
            _id : id,
            'current.lastChangeTimestamp' : lastChangeTimestamp
        }, {
            '$set' : processedDoc
        }).then(function (array) {
            var numUpdates = array[0];
            if (numUpdates == 1) {
                return self.processFromDB({
                    _id : id,
                    current : doc
                });
            } else {
                return Q.reject("Modification concurrente.");
            }
        });
    },

    get : function (id) {
        var self = this;
        return Q.ninvoke(self.collection, "findOne", {
            _id : new ObjectID(id),
        }, {
            fields : {
                "current" : 1
            }
        }).then(function (res) {
            if (res) {
                return self.processFromDB(res);
            } else {
                return Q.reject(new NotFoundError());
            }
        });
    },

    search : function (query, options) {
        var self = this;
        query = query || {};
        options = options || {};
        return Q.ninvoke(self.collection.find(query, {
            "current" : 1
        }, options), "toArray").then(function (array) {
            return array.map(self.processFromDB, self);
        });
    },

    suggestions : function (query) {
        throw new Error("Not implemented.");

    }

});
