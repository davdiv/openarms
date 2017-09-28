var express = require("express");
var bodyParser = require("./bodyParser");
var idValidator = require("./idValidator");
var ValidationError = require("../common/validation/utils/validationError");

var RestRouter = function (dbCollection, keycloak, readRole, writeRole) {
    var router = express.Router();
    router.param("id", idValidator)

    router.post("/", keycloak.protect(writeRole), bodyParser, function (req, res, next) {
        dbCollection.insert(req.body, req).then(function (doc) {
            res.status(200).send(doc);
        }).then(null, next);
    });

    router.post("/search", keycloak.protect(readRole), bodyParser, function (req, res, next) {
        var body = req.body || {};
        dbCollection.search(body.query, body.options).then(function (array) {
            res.status(200).send(array);
        }).then(null, next);
    });

    router.get("/suggestions", keycloak.protect(readRole), function (req, res, next) {
        var query = req.query.q;
        dbCollection.suggestions(query).then(function (array) {
            res.status(200).send(array);
        }).then(null, next);
    });

    router.get("/:id", keycloak.protect(readRole), function (req, res, next) {
        dbCollection.get(req.params.id).then(function (doc) {
            res.set("ETag", '"' + doc.lastChangeTimestamp.getTime() + '"');
            res.set("Last-Modified", doc.lastChangeTimestamp.toUTCString());
            if (res.fresh) {
                res.status(304).send();
            } else {
                res.status(200).send(doc);
            }
        }).then(null, next);
    });

    router.put("/:id", keycloak.protect(writeRole), bodyParser, function (req, res, next) {
        if (req.body.id !== req.params.id) {
            next(new ValidationError("id.different", req.body.id, [ req.body.id, req.params.id ]));
            return;
        }
        dbCollection.save(req.body, req).then(function (doc) {
            res.status(200).send(doc);
        }).then(null, next);
    });
    return router;
};

module.exports = RestRouter;
