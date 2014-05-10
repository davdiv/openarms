var klass = require("hsp/klass");
var RestCache = require("./restCache");
var validateAccountSheet = require("./model/accountSheets");

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
