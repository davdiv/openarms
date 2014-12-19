module.exports = function (content, fileName, options) {
    var blob = new Blob(content, options);
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    setTimeout(function () {
        link.parentNode.removeChild(link);
        URL.revokeObjectURL(url);
        link = null;
    }, 0);
};