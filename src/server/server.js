var q = require("q");
var express = require("express");
var path = require("path");
var routes = require("../common/routes.js");

var startServer = function (options) {
    var defer = q.defer();
    var staticsRoot = path.join(__dirname, "../../build/client");
    var htmlFile = path.join(staticsRoot, options.dev ? "statics-dev" : "statics", "index.html");

    var sendHtmlFile = function (req, res) {
        res.sendfile(htmlFile);
    };

    var app = express();

    routes.forEach(function (curRoute) {
        app.get(curRoute.path, sendHtmlFile);
    });

    app.use(express.static(staticsRoot));

    var server = app.listen(options.port);
    server.on("listening", function () {
        console.log("Web server started on http://localhost:%d", server.address().port);
    });

    return defer.promise;
};

module.exports = startServer;