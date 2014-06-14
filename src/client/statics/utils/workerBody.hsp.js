module.exports = (function (staticsRootDirectory, mainScript) {
    importScripts(mainScript);
    var currentContext = noder.require("noder-js/currentContext");
    currentContext.loader.baseUrl = staticsRootDirectory;
    onmessage = function (event) {
        var data = event.data;
        var createReport = function (result) {
            return function () {
                postMessage({
                    result : result,
                    arguments : [].slice.call(arguments, 0)
                });
            };
        };
        noder.asyncRequire(data.module).spreadSync(function (workerModule) {
            return workerModule.apply(null, data.arguments);
        }).thenSync(createReport("resolve"), createReport("reject"));
    };
}) + "";
