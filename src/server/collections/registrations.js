var CollectionBase = require("./utils/collectionBase");
var validate = require("../../common/validation/registrations");

module.exports = class extends CollectionBase {

    processToDB (doc) {
        validate(doc);
        return super.processToDB(doc);
    }

};
