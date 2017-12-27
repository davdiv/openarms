var klass = require("hsp/klass");
var RestCache = require("./utils/restCache");

var KeycloakPeopleCache = klass({
    $extends : RestCache,
    $constructor : function () {
        RestCache.$constructor.call(this, "keycloak");
    },
    readRole : "readPeople",
    canSave: function() {
        return false;
    }
});

module.exports = new KeycloakPeopleCache();
