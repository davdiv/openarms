var klass = require("hashspace/hsp/klass");
var recompute = require("../../common/model/account/sheet/recompute");
var validate = require("../../common/model/accountSheets");
var CollectionBase = require("../database/collectionBase");

module.exports = klass({
    $extends : CollectionBase,

    processToDB : function (doc) {
        validate(doc);
        recompute(doc);
        return CollectionBase.processToDB.call(this, doc);
    }

});
