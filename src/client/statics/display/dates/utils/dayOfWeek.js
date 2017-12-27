var days = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi"
];

module.exports = function (jsDate) {
    if (!jsDate) {
        return "";
    }
    return days[jsDate.getDay()];
};
