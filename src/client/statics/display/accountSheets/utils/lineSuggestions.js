var SimpleSuggestions = require("../../../utils/simpleSuggestions");

var instance = new SimpleSuggestions([ "Colis alimentaires + lait", "Vêtements", "Epicerie", "Frais", "Légumes", "Café", "Déco", "Pacome", "Autoroute", "Achats (" ]);

module.exports = instance.onComputeSuggestions;
