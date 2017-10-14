var ObjectID = require("mongodb").ObjectID;
var NotFoundError = require("../../../common/notFoundError");
var SimpleError = require("../../../common/simpleError");

module.exports = class {
    constructor(collection, historyCollection) {
        this.collection = collection;
        this.historyCollection = historyCollection;
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

    async insert(doc, req) {
        var self = this;
        var processedDoc = self.processToDB(doc);
        processedDoc.current.lastChangeBy = req.kauth.grant.access_token.content.sub;
        processedDoc.current.lastChangeTimestamp = new Date();
        const result = await this.collection.insert(processedDoc);
        return self.processFromDB(result.ops[0]);
    }

    async remove(docId, lastChangeTimestamp, req) {
        const id = new ObjectID(docId);
        const previousDoc = await this.collection.findOne({
            _id: id
        }, {
            fields : {
                "current" : 1
            }
        });
        if (!previousDoc) {
            return await Promise.reject(new SimpleError("Le document à supprimer n'existe pas (ou plus)."));
        }
        const oldCurrent = previousDoc.current;
        const concurrentModification = oldCurrent.lastChangeTimestamp.getTime() !== lastChangeTimestamp;
        if (!concurrentModification) {
            var removeInfo = {
                lastChangeTimestamp: new Date(),
                lastChangeBy: req.kauth.grant.access_token.content.sub
            };
            const result = await this.collection.remove({
                _id : id,
                'current.lastChangeTimestamp' : oldCurrent.lastChangeTimestamp
            });
            const numUpdates = result.result.n;
            if (numUpdates == 1) {
                if (this.historyCollection) {
                    await this.historyCollection.insert({
                        id: id,
                        version: oldCurrent,
                        deleted: removeInfo
                    });
                }
                return {};
            }
        }
        return await Promise.reject(new SimpleError("Modification concurrente."));
    }

    async save(doc, req) {
        const id = new ObjectID(doc.id);
        const previousDoc = await this.collection.findOne({
            _id: id
        }, {
            fields : {
                "current" : 1
            }
        });
        if (!previousDoc) {
            return await Promise.reject(new SimpleError("Le document à mettre à jour n'existe pas (ou plus)."));
        }
        const oldCurrent = previousDoc.current;
        const processedDoc = this.processToDB(doc);
        const newCurrent = processedDoc.current;
        const lastChangeTimestamp = newCurrent.lastChangeTimestamp;
        const concurrentModification = oldCurrent.lastChangeTimestamp.getTime() !== lastChangeTimestamp.getTime();
        if (!concurrentModification) {
            newCurrent.lastChangeTimestamp = new Date();
            newCurrent.lastChangeBy = req.kauth.grant.access_token.content.sub;
            const result = await this.collection.update({
                _id : id,
                'current.lastChangeTimestamp' : lastChangeTimestamp
            }, {
                '$set' : processedDoc
            });
            const numUpdates = result.result.nModified;
            if (numUpdates == 1) {
                if (this.historyCollection) {
                    await this.historyCollection.insert({
                        id: id,
                        version: previousDoc.current
                    });
                }
                return this.processFromDB({
                    _id : id,
                    current : doc
                });
            }
        }
        return await Promise.reject(new SimpleError("Modification concurrente."));
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
