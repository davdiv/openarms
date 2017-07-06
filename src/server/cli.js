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
            "db-url" : process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/test',
            "db-empty" : process.env.OPENARMS_DB_EMPTY == "empty"
        }
    });
};

var execute = async function(options) {
    if (options.version) {
        console.log(require("../../package.json").version);
        return 0;
    } else if (options.help) {
        var packageJson = require("../../package.json");
        console.log(packageJson.name + ": " + packageJson.description);
        return 0;
    } else {
        var server = require("./server");
        await server(options);
    }
};

module.exports = async function(argv) {
    try {
      var options = parse(argv);
      return await execute(options);
    } catch (e) {
      console.error(e.stack || e);
      return 1;
    }
};
