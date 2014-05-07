var peopleMgr = require("../../peopleMgr");

var getId = function(object) {
    return object.id;
};

var mapGetId = function(array) {
    return array.map(getId);
};

var suggestions = module.exports = function(text) {
    var regExp = new RegExp(text, "i");
    return peopleMgr.search({
        $or : [ {
            "current.firstName" : regExp
        }, {
            "current.lastName" : regExp
        }, {
            "current.familyName" : regExp
        } ]
    }, {
        limit : 10,
        sort : [ [ "current.firstName", "asc" ], [ "current.lastName", "asc" ] ]
    }).thenSync(mapGetId);
};

suggestions.onComputeSuggestions = function(event) {
    event.returnValue = suggestions(event.text);
};
