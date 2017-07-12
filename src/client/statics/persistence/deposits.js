var klass = require("hsp/klass");
var RestCache = require("./utils/restCache");
var validateDeposit = require("../validation/deposits/validate");

var DepositsCache = klass({
    $extends : RestCache,
    $constructor : function () {
        RestCache.$constructor.call(this, "account/deposits");
    },

    saveItemContent : function (object) {
        validateDeposit(object);
        return RestCache.saveItemContent.call(this, object);
    }
});

module.exports = new DepositsCache();
