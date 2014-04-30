exports.extractURL = function (dataTransfer) {
    var url = dataTransfer.getData("URL");
    if (!url) {
        if (dataTransfer.types.indexOf("text/uri-list") > -1) {
            return true;
        }
    }
    return url;
};