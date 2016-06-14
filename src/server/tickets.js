var rawBody = require("raw-body");

module.exports = function (dbCollection) {
    return {
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
                    res.send(200, "OK");
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
                    res.send(200, {
                        date: result.date,
                        data: result.data.toString("ascii")
                    });
                } else {
                    res.send(404);
                }
            });
        }
    }
};
