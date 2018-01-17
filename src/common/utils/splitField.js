module.exports = function(value) {
    var values = (value || "").split(",");
    for (var i = 0; i < values.length; i++) {
        if (!values[i]) {
            values.splice(i, 1);
            i--;
        }
    }
    return values;
};
