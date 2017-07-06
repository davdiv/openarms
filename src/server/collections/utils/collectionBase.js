var ObjectID = require("mongodb").ObjectID;
var NotFoundError = require("../../../common/notFoundError");

module.exports = class {
    constructor(collection) {
        this.collection = collection;
    }

    processFromDB(doc) {
        var res = doc.current;
        res.id = doc._id.toString();
        return res;
    }

    processToDB(doc) {
        delete doc.id;
        return {
            current : doc
        };
    }

    async insert(doc) {
        var self = this;
        var processedDoc = self.processToDB(doc);
        processedDoc.current.lastChangeTimestamp = new Date();
        const result = await this.collection.insert(processedDoc);
        return self.processFromDB(result.ops[0]);
    }

    save(doc) {
        var self = this;
        var id = new ObjectID(doc.id);
        var processedDoc = self.processToDB(doc);
        var current = processedDoc.current;
        var lastChangeTimestamp = current.lastChangeTimestamp;
        current.lastChangeTimestamp = new Date();
        return this.collection.update({
            _id : id,
            'current.lastChangeTimestamp' : lastChangeTimestamp
        }, {
            '$set' : processedDoc
        }).then(function (result) {
            var numUpdates = result.result.nModified;
            if (numUpdates == 1) {
                return self.processFromDB({
                    _id : id,
                    current : doc
                });
            } else {
                return Promise.reject("Modification concurrente.");
            }
        });
    }

    get(id) {
        var self = this;
        return self.collection.findOne({
            _id : new ObjectID(id),
        }, {
            fields : {
                "current" : 1
            }
        }).then(function (res) {
            if (res) {
                return self.processFromDB(res);
            } else {
                return Promise.reject(new NotFoundError());
            }
        });
    }

    search(query, options) {
        var self = this;
        query = query || {};
        options = options || {};
        return self.collection.find(query, {
            "current" : 1
        }, options).toArray().then(function (array) {
            return array.map(self.processFromDB, self);
        });
    }

    suggestions(query) {
        throw new Error("Not implemented.");

    }

};
