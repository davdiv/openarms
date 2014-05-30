var klass = require("hashspace/hsp/klass");
var CollectionBase = require("./utils/collectionBase");
var validate = require("../../common/validation/registrations");

module.exports = klass({
    $extends : CollectionBase,

    processToDB : function (doc) {
        validate(doc);
        return CollectionBase.processToDB.call(this, doc);
    }

});
