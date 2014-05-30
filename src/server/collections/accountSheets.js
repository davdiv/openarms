var klass = require("hashspace/hsp/klass");
var CollectionBase = require("./utils/collectionBase");
var recompute = require("../../common/validation/accountSheets/recompute");
var validate = require("../../common/validation/accountSheets/validate");

module.exports = klass({
    $extends : CollectionBase,

    processToDB : function (doc) {
        validate(doc);
        recompute(doc);
        return CollectionBase.processToDB.call(this, doc);
    }

});
