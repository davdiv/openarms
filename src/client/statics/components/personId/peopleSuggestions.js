var peopleMgr = require("../../peopleMgr");

var getId = function (object) {
    return object.id;
};

var mapGetId = function (array) {
    return array.map(getId);
};

var suggestions = module.exports = function (text) {
    return peopleMgr.suggestions(text).thenSync(mapGetId);
};

suggestions.onComputeSuggestions = function (event) {
    event.returnValue = suggestions(event.text);
};
