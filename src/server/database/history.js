var ObjectID = require("mongodb").ObjectID;
var Q = require("q");

var postProcessDoc = function(doc) {
    var res = doc.current;
    res.id = doc._id.toString();
    return res;
};

exports.insert = function(collection, doc) {
    doc.lastChangeTimestamp = new Date();
    return Q.ninvoke(collection, "insert", [ {
        current : doc
    } ]).then(function(array) {
        return postProcessDoc(array[0]);
    });
};

exports.save = function(collection, doc) {
    var id = new ObjectID(doc.id);
    delete doc.id;
    var lastChangeTimestamp = doc.lastChangeTimestamp;
    doc.lastChangeTimestamp = new Date();
    return Q.ninvoke(collection, "update", {
        _id : id,
        'current.lastChangeTimestamp' : lastChangeTimestamp
    }, {
        '$set' : {
            current : doc
        }
    }).then(function(array) {
        var numUpdates = array[0];
        if (numUpdates == 1) {
            return postProcessDoc({
                _id : id,
                current : doc
            });
        } else {
            return Q.reject("Modification concurrente.");
        }
    });
};

exports.get = function(collection, id) {
    return Q.ninvoke(collection, "findOne", {
        _id : new ObjectID(id),
    }, {
        fields : {
            "current" : 1
        }
    }).then(function(res) {
        if (res) {
            return postProcessDoc(res);
        } else {
            return Q.reject("Non trouvé");
        }
    });
};

exports.search = function(collection, query, options) {
    query = query || {};
    options = options || {};
    return Q.ninvoke(collection.find(query, {
        "current" : 1
    }, options), "toArray").then(function(array) {
        return array.map(postProcessDoc);
    });
};
