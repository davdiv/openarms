var q = require("q");
var express = require("express");
var path = require("path");
var routes = require("../common/routes.js");
var serialization = require("../common/serialization");
var RestRouter = require("./restRouter");
var apiErrorReporter = require("./apiErrorReporter");
var initDatabase = require("./database/init");
var CollectionBase = require("./collections/utils/collectionBase");
var PeopleCollection = require("./collections/people");
var RegistrationsCollection = require("./collections/registrations");
var AccountSheetsCollection = require("./collections/accountSheets");
var ticketsHandler = require("./tickets");

var startServer = function (options, db) {
    var defer = q.defer();
    var staticsRoot = path.join(__dirname, "../../build/client");
    var devHtmlFile = path.join(staticsRoot, "statics-dev/index.html");
    var prodHtmlFile = path.join(staticsRoot, "statics/index.html");

    var sendHtmlFile = function (req, res) {
        var dev = "dev" in req.query ? req.query.dev != "false" : options.dev;
        res.sendfile(dev ? devHtmlFile : prodHtmlFile);
    };

    var app = express();

    app.set("json replacer", serialization.replacer);

    routes.forEach(function (curRoute) {
        app.get(curRoute.path, sendHtmlFile);
    });

    app.use(express.static(staticsRoot));

    var tickets = ticketsHandler(db.collection("tickets"));

    app.use("/api/people", new RestRouter(new PeopleCollection(db.collection("people"))));
    app.use("/api/registrations", new RestRouter(new RegistrationsCollection(db.collection("registrations"))));
    app.use("/api/visits", new RestRouter(new CollectionBase(db.collection("visits"))));
    app.use("/api/account/sheets", new RestRouter(new AccountSheetsCollection(db.collection("accountSheets"))));
    app.get("/api/tickets/:printer/latest", tickets.latest);
    app.use("/api", apiErrorReporter);

    app.post("/tickets/print/:printer", tickets.print);

    var server = app.listen(options.port);
    server.on("listening", function () {
        console.log("Web server started on http://localhost:%d", server.address().port);
    });

    return defer.promise;
};

module.exports = function (options) {
    return initDatabase(options).then(startServer.bind(null, options));
};
