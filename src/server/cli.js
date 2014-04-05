var q = require("q");

var parse = function (argv) {
    var minimist = require("minimist");
    return minimist(argv, {
        "string" : [],
        "boolean" : [ "help", "version", "dev" ],
        "alias" : {
            "help" : "h",
            "version" : "v"
        },
        "default" : {
            port: 8080
        }
    });
};

var execute = function (options) {
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

module.exports = function (argv) {
    var options = parse(argv);
    return execute(options);
};
