var promise = require("noder-js/promise");

var workerBody = require("./workerBody.hsp.js");

var workerURL;
var getWorkerURL = function () {
    if (!workerURL) {
        var array = [ "(", workerBody + ")(", JSON.stringify(staticsRootDirectory), ",", JSON.stringify(mainScript),
            ");" ];
        var blob = new Blob(array, {
            type : "text/javascript"
        });
        workerURL = URL.createObjectURL(blob);
    }
    return workerURL;
};

var freeWorkers = [];

var createWorker = function () {
    if (freeWorkers.length > 0) {
        return freeWorkers.shift();
    } else {
        return new Worker(getWorkerURL());
    }
};

var releaseWorker = function (worker) {
    worker.onmessage = null;
    freeWorkers.push(worker);
};

var executeInWorker = module.exports = function (module, args) {
    var defer = promise.defer();
    worker = createWorker();
    worker.onmessage = function (event) {
        var data = event.data;
        var fct = defer[data.result];
        fct.apply(defer, data.arguments);
        releaseWorker(worker);
    };
    worker.postMessage({
        module : module,
        arguments : args || []
    });
    return defer.promise;
};
