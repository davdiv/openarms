var CollectionBase = require("./utils/collectionBase");
var recompute = require("../../common/validation/deposits/recompute");
var validate = require("../../common/validation/deposits/validate");

module.exports = class extends CollectionBase {

    processToDB (doc) {
        validate(doc);
        recompute(doc);
        return super.processToDB(doc);
    }
};
