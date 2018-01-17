var CollectionBase = require("./utils/collectionBase");
var validate = require("../../common/validation/people");
var diacriticsRegExp = require("../../common/utils/diacriticsRegExp");

module.exports = class extends CollectionBase {

    processToDB(doc) {
        validate(doc);
        return super.processToDB(doc);
    }

    suggestions(query) {
        var regExpSrc = diacriticsRegExp(query);
        var regExp = new RegExp(regExpSrc, "i");
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
};
