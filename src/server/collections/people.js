var klass = require("hashspace/hsp/klass");
var CollectionBase = require("../database/collectionBase");

module.exports = klass({
    $extends : CollectionBase,

    suggestions : function (query) {
        var regExp = new RegExp(query, "i");
        return this.search({
            $or : [ {
                "current.firstName" : regExp
            }, {
                "current.lastName" : regExp
            }, {
                "current.familyName" : regExp
            } ]
        }, {
            limit : 10,
            sort : [ [ "current.firstName", "asc" ], [ "current.lastName", "asc" ] ]
        });
    }
});
