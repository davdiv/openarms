var klass = require("hsp/klass");
var RestCache = require("./utils/restCache");
var validateAccountSheet = require("../validation/accountSheets/validate");

var AccountSheetsCache = klass({
    $extends : RestCache,
    $constructor : function () {
        RestCache.$constructor.call(this, "account/sheets");
    },

    saveItemContent : function (object) {
        validateAccountSheet(object);
        return RestCache.saveItemContent.call(this, object);
    }
});

module.exports = new AccountSheetsCache();
