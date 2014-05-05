var q = require("q");
var mongodb = require("mongodb");

var parse = function(argv) {
    var minimist = require("minimist");
    return minimist(argv, {
        "string" : [],
        "boolean" : [ "help", "version", "dev", "db-empty" ],
        "alias" : {
            "help" : "h",
            "version" : "v"
        },
        "default" : {
            "port" : parseInt(process.env.PORT, 10) || 8080,
            "db-url" : process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || mongodb.Db.DEFAULT_URL,
            "db-empty" : process.env.OPENARMS_DB_EMPTY == "empty"
        }
    });
};

var execute = function(options) {
    if (options.version) {
        console.log(require("../../package.json").version);
        return q(0);
    } else if (options.help) {
        var packageJson = require("../../package.json");
        console.log(packageJson.name + ": " + packageJson.description);
        return q(0);
    } else {
        var server = require("./server");
        return server(options);
    }
};

module.exports = function(argv) {
    var options = parse(argv);
    return execute(options);
};
