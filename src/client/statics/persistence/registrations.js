var klass = require("hsp/klass");
var RestCache = require("./utils/restCache");
var validateRegistration = require("../validation/registrations");

var RegistrationsCache = klass({
    $extends : RestCache,
    $constructor : function () {
        RestCache.$constructor.call(this, "registrations");
    },

    saveItemContent : function (object) {
        validateRegistration(object);
        return RestCache.saveItemContent.call(this, object);
    }
});

module.exports = new RegistrationsCache();
