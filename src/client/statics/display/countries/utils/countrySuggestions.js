var isNotMetaData = require("../../../serialization").isNotMetaData;
var countries = require("./countriesList");
var diacritics = require("diacritics");

var createCountryObject = function(countryKey) {
    var countryName = countries[countryKey];
    return {
        name : countryName,
        asciiName : diacritics.remove(countryName).toUpperCase(),
        code : countryKey
    };
};

var countriesList = Object.keys(countries).filter(isNotMetaData).map(createCountryObject);
countriesList.sort(function(c1, c2) {
    return (c1.asciiName > c2.asciiName ? 1 : -1);
});
var maxEntries = 10;

var computeSuggestions = function(text) {
    text = diacritics.remove(text.trim()).toUpperCase();
    var exactCode = [];
    if (countries.hasOwnProperty(text)) {
        exactCode.push(text);
    }
    var begin = [];
    var inside = [];
    for ( var i = 0, l = countriesList.length; i < l; i++) {
        var curCountry = countriesList[i];
        var indexInName = curCountry.asciiName.indexOf(text);
        if (curCountry.code == text) {
            // already in exactCode
        } else if (indexInName == 0) {
            begin.push(curCountry.code);
        } else if (indexInName > -1 && inside.length <= maxEntries) {
            inside.push(curCountry.code);
        }
        if (begin.length >= maxEntries) {
            break;
        }
    }
    return exactCode.concat(begin, inside).slice(0, maxEntries);
};

computeSuggestions.onComputeSuggestions = function(event) {
    event.returnValue = computeSuggestions(event.text);
};

computeSuggestions.onEnter = function(event) {
    var text = event.text.trim();
    if (text) {
        var upperCaseNoAccent = diacritics.remove(text).toUpperCase();
        for ( var i = 0, l = countriesList.length; i < l; i++) {
            var curCountry = countriesList[i];
            if (curCountry.find === upperCaseNoAccent || curCountry.code === upperCaseNoAccent) {
                text = curCountry.code;
                break;
            }
        }
        event.suggestion = text;
    }
};

module.exports = computeSuggestions;
