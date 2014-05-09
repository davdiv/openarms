var q = require("q");
var express = require("express");
var path = require("path");
var routes = require("../common/routes.js");
var serialization = require("../common/serialization");
var RestRouter = require("./restRouter");
var initDatabase = require("./database/init");
var CollectionBase = require("./database/collectionBase");
var PeopleCollection = require("./collections/people");

var startServer = function(options, db) {
    var defer = q.defer();
    var staticsRoot = path.join(__dirname, "../../build/client");
    var htmlFile = path.join(staticsRoot, options.dev ? "statics-dev" : "statics", "index.html");

    var sendHtmlFile = function(req, res) {
        res.sendfile(htmlFile);
    };

    var app = express();

    app.set("json replacer", serialization.replacer);

    routes.forEach(function(curRoute) {
        app.get(curRoute.path, sendHtmlFile);
    });

    app.use(express.static(staticsRoot));

    app.use("/api/people", new RestRouter(new PeopleCollection(db.collection("people"))));
    app.use("/api/registrations", new RestRouter(new CollectionBase(db.collection("registrations"))));
    app.use("/api/visits", new RestRouter(new CollectionBase(db.collection("visits"))));
    app.use("/api/account/sheets", new RestRouter(new CollectionBase(db.collection("accountSheets"))));

    var server = app.listen(options.port);
    server.on("listening", function() {
        console.log("Web server started on http://localhost:%d", server.address().port);
    });

    return defer.promise;
};

module.exports = function(options) {
    return initDatabase(options).then(startServer.bind(null, options));
};
