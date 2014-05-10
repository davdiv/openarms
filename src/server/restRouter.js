var express = require("express");
var bodyParser = require("./bodyParser");
var idValidator = require("./idValidator");
var ValidationError = require("../common/validationError");

var RestRouter = function (dbCollection) {
    var router = express.Router();
    router.param("id", idValidator)

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
            next(new ValidationError("id.different", req.body.id, [ req.body.id, req.params.id ]));
            return;
        }
        dbCollection.save(req.body).then(function (doc) {
            res.send(200, doc);
        }).then(null, next);
    });
    return router;
};

module.exports = RestRouter;
