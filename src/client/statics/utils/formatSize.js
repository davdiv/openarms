var units = [ "Go", "Mo", "ko", "o" ];

module.exports = function (size) {
    if (size == null) {
        return "";
    }
    var unitIndex = units.length - 1;
    while (size > 1024 && unitIndex > 0) {
        size = size / 1024;
        unitIndex--;
    }
    return Math.round(size) + " " + units[unitIndex];
};