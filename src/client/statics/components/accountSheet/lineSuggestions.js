var SimpleSuggestions = require("../../utils/simpleSuggestions");

var instance = new SimpleSuggestions([ "Colis alimentaires + lait", "Vêtements", "Epicerie", "Frais", "Légumes" ]);

module.exports = instance.onComputeSuggestions;