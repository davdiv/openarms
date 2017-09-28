var klass = require("hsp/klass");
var RestCache = require("./utils/restCache");
var validatePerson = require("../validation/people");

var PeopleCache = klass({
    $extends : RestCache,
    $constructor : function () {
        RestCache.$constructor.call(this, "people");
    },
    readRole : "readPeople",
    writeRole : "writePeople",
    saveItemContent : function (object) {
        validatePerson(object);
        return RestCache.saveItemContent.call(this, object);
    }
});

module.exports = new PeopleCache();
