var express = require("express");
var path = require("path");
var routes = require("../common/routes.js");
var serialization = require("../common/serialization");
var RestRouter = require("./restRouter");
var apiErrorReporter = require("./apiErrorReporter");
var initDatabase = require("./database/init");
var PeopleCollection = require("./collections/people");
var AccountSheetsCollection = require("./collections/accountSheets");
var DepositsCollection = require("./collections/deposits");
var ticketsHandler = require("./tickets");
var Keycloak = require("keycloak-connect");

var startServer = async function (options, db) {
    var staticsRoot = path.join(__dirname, "../../build/client");
    var devHtmlFile = path.join(staticsRoot, "statics-dev/index.html");
    var prodHtmlFile = path.join(staticsRoot, "statics/index.html");
    var keycloakUIjson = path.resolve(options['keycloak-ui']);
    var keycloakBackendjson = path.resolve(options['keycloak-backend']);

    var sendHtmlFile = function (req, res) {
        var dev = "dev" in req.query ? req.query.dev != "false" : options.dev;
        res.sendFile(dev ? devHtmlFile : prodHtmlFile);
    };

    var keycloak = new Keycloak({}, keycloakBackendjson);
    var app = express();

    app.set("json replacer", serialization.replacer);

    app.use(keycloak.middleware());
    routes.forEach(function (curRoute) {
        app.get(curRoute.path, sendHtmlFile);
    });
    app.get("/keycloak.json", function (req, res) {
        res.sendFile(keycloakUIjson);
    });

    app.use(express.static(staticsRoot));

    app.use(keycloak.protect());
    var tickets = ticketsHandler(db.collection("tickets"));

    app.use("/api/people", new RestRouter(new PeopleCollection(db.collection("people"))));
    app.use("/api/account/sheets", new RestRouter(new AccountSheetsCollection(db.collection("accountSheets"))));
    app.use("/api/account/deposits", new RestRouter(new DepositsCollection(db.collection("deposits"))));
    app.get("/api/tickets/:printer/latest", tickets.latest);
    app.use("/api", apiErrorReporter);

    app.post("/tickets/print/:printer", tickets.print);

    var server = app.listen(options.port);
    server.on("listening", function () {
        console.log("Web server started on http://localhost:%d", server.address().port);
    });

    await new Promise(() => {});
};

module.exports = async function (options) {
    const db = await initDatabase(options)
    await startServer(options, db);
};
