var diacritics = require("diacritics");
var maxEntries = 10;

var sortByAsciiName = function(a, b) {
    return (a.asciiLabel > b.asciiLabel ? 1 : -1);
};

var SimpleSuggestionsList = function(list) {
    this.suggestions = list.map(function(suggestion) {
        return {
            label : suggestion,
            asciiLabel : diacritics.remove(suggestion).toUpperCase()
        };
    });
    this.onComputeSuggestions = this.onComputeSuggestions.bind(this);
};

SimpleSuggestionsList.prototype.computeSuggestions = function(text) {
    text = diacritics.remove(text.trim()).toUpperCase();
    var begin = [];
    var inside = [];
    var suggestions = this.suggestions;
    for ( var i = 0, l = suggestions.length; i < l; i++) {
        var curSuggestion = suggestions[i];
        var index = curSuggestion.asciiLabel.indexOf(text);
        if (index == 0) {
            begin.push(curSuggestion.label);
        } else if (index > -1 && (inside.length + begin.length) <= maxEntries) {
            inside.push(curSuggestion.label);
        }
        if (begin.length >= maxEntries) {
            break;
        }
    }
    return begin.concat(inside).slice(0, maxEntries);
};

SimpleSuggestionsList.prototype.onComputeSuggestions = function(event) {
    event.returnValue = this.computeSuggestions(event.text);
};

module.exports = SimpleSuggestionsList;
