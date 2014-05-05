var express = require("express");
var getRawBody = require("raw-body");
var serialization = require('../common/serialization');
var dbHistory = require("./database/history");

var bodyParser = function(req, res, next) {
    getRawBody(req, {
        length : req.headers["content-length"],
        limit : "1mb",
        encoding : "utf8"
    }, function(err, string) {
        if (err) {
            return next(err);
        }
        req.body = serialization.parse(string);
        next();
    })
};

var RestRouter = function(dbCollection) {
    var router = express.Router();
    router.post("/", bodyParser, function(req, res, next) {
        dbHistory.insert(dbCollection, req.body).then(function(doc) {
            res.send(200, serialization.stringify(doc));
        }).then(null, next);
    });

    router.get("/:id", function(req, res, next) {
        dbHistory.get(dbCollection, req.params.id).then(function(doc) {
            res.send(200, serialization.stringify(doc));
        }).then(null, next);
    });

    router.put("/:id", bodyParser, function(req, res, next) {
        if (req.body.id !== req.params.id)  {
            res.send(404, "Impossible d'enregistrer le document!!");
            return;
        }
        dbHistory.save(dbCollection, req.body).then(function(doc) {
            res.send(200, serialization.stringify(doc));
        }).then(null, next);
    });
    return router;
};

module.exports = RestRouter;