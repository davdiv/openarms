var rawBody = require("raw-body");
var split = require("../common/utils/splitField");

var checkAllowedPrinter = function (req, res, next) {
    const token = req.kauth.grant.access_token.content;
    const printers = split(token.banknotesPrinters).concat(split(token.coinsPrinters));
    const printer = req.params.printer;
    if (printers.indexOf(printer) === -1) {
        res.status(403).send({});
        return;
    }
    return next();
};

module.exports = function (dbCollection) {
    return {
        checkAllowedPrinter: checkAllowedPrinter,
        print: function (req, res, next) {
            var printer = req.params.printer;
            rawBody(req, {
                length : req.headers["content-length"],
                limit : "1mb"
            }, function (err, data) {
                if (err) {
                    return next(err);
                }
                dbCollection.insert({
                    printer: printer,
                    date: new Date(),
                    data: data
                }, function (err, data) {
                    if (err) {
                        console.log("Error while saving ticket from ", printer, err);
                        return next(err);
                    }
                    res.status(200).send("OK");
                    console.log("Saved ticket from ", printer);
                });
            });
        },
        latest: function (req, res, next) {
            var printer = req.params.printer;
            dbCollection.findOne({
                printer: printer
            }, {
                sort: [ ["date", -1] ]
            }, function (err, result) {
                if (err) {
                    return next(err);
                }
                if (result) {
                    res.status(200).send({
                        date: result.date,
                        data: result.data.toString("ascii")
                    });
                } else {
                    res.status(404).send();
                }
            });
        }
    }
};
