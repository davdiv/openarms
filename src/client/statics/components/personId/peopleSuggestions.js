var peopleMgr = require("../../peopleMgr");

exports.onComputeSuggestions = function (event) {
    event.returnValue = peopleMgr.search(event.text);
};
