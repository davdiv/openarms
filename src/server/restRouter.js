var express = require("express");
var bodyParser = require("./bodyParser");

var RestRouter = function (dbCollection) {
    var router = express.Router();
    router.post("/", bodyParser, function (req, res, next) {
        dbCollection.insert(req.body).then(function (doc) {
            res.send(200, doc);
        }).then(null, next);
    });

    router.post("/search", bodyParser, function (req, res, next) {
        var body = req.body || {};
        dbCollection.search(body.query, body.options).then(function (array) {
            res.send(200, array);
        }).then(null, next);
    });

    router.get("/suggestions", function (req, res, next) {
        var query = req.query.q;
        dbCollection.suggestions(query).then(function (array) {
            res.send(200, array);
        }).then(null, next);
    });

    router.get("/:id", function (req, res, next) {
        dbCollection.get(req.params.id).then(function (doc) {
            res.set("ETag", '"' + doc.lastChangeTimestamp.getTime() + '"');
            res.set("Last-Modified", doc.lastChangeTimestamp.toUTCString());
            if (res.fresh) {
                res.send(304);
            } else {
                res.send(200, doc);
            }
        }).then(null, next);
    });

    router.put("/:id", bodyParser, function (req, res, next) {
        if (req.body.id !== req.params.id) {
            res.send(404, "Id incorrect.");
            return;
        }
        dbCollection.save(req.body).then(function (doc) {
            res.send(200, doc);
        }).then(null, next);
    });
    return router;
};

module.exports = RestRouter;
