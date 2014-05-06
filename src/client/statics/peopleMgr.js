var klass = require("hsp/klass");
var RestCache = require("./restCache");

var PeopleCache = klass({
    $extends : RestCache,
    $constructor : function() {
        RestCache.$constructor.call(this, "people");
    }
});

module.exports = new PeopleCache();
