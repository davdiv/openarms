var removeDelimiters = function (str) {
    if (str == null) {
        return "";
    }
    str = str + "";
    return str.replace(/\t/g, "    ").replace(/\r|\n/g, " ");
};

module.exports = function (columnsDefinition, dataArray) {
    var content = [];
    columnsDefinition.forEach(function (column, index) {
        if (index > 0) {
            content.push("\t");
        }
        content.push(removeDelimiters(column.title));
    });
    content.push("\n");
    dataArray.forEach(function (object) {
        columnsDefinition.forEach(function (column, index) {
            if (index > 0) {
                content.push("\t");
            }
            content.push(removeDelimiters(column.getValue(object)));
        });
        content.push("\n");
    });
    return content.join("");
};
