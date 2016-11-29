var SimpleSuggestions = require("../../../utils/simpleSuggestions");

var instance = new SimpleSuggestions([ "Grasse", "Vallauris", "Vallauris Ameublement", "Vallauris café/librairie" ]);

module.exports = {
    onComputeSuggestions : instance.onComputeSuggestions,
    onEnter : function(event) {
        event.preventDefault = true;
        event.suggestion = event.text;
        event.text = "";
    }
};
