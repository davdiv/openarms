var ObjectID = require("mongodb").ObjectID;
var Q = require("q");

exports.insert = function(collection, doc) {
    doc.lastChangeTimestamp = new Date();
    return Q.ninvoke(collection, "insert", [ {
        current : doc
    } ]).then(function(array) {
        var res = array[0];
        res.current.id = res._id.toString();
        return res.current;
    });
};

exports.save = function(collection, doc) {
    var id = doc.id;
    delete doc.id;
    var lastChangeTimestamp = doc.lastChangeTimestamp;
    doc.lastChangeTimestamp = new Date();
    return Q.ninvoke(collection, "update", {
        _id : new ObjectID(id),
        'current.lastChangeTimestamp': lastChangeTimestamp
    }, {
        '$set' : {
            current : doc
        }
    }).then(function(array) {
        var numUpdates = array[0];
        if (numUpdates == 1) {
            doc.id = id;
            return doc;
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
            res.current.id = res._id.toString();
            return res.current;
        } else {
            return Q.reject("Non trouvé");
        }
    });
};