var CollectionBase = require("./utils/collectionBase");
var recompute = require("../../common/validation/accountSheets/recompute");
var validate = require("../../common/validation/accountSheets/validate");

module.exports = class extends CollectionBase {

    processToDB (doc) {
        validate(doc);
        recompute(doc);
        return CollectionBase.processToDB.call(this, doc);
    }
};
