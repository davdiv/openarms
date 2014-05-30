var request = require("noder-js/request");
var serialization = require("../../serialization");
var promise = require("noder-js/promise");

var ConnectionError = function () {
};

var UnknownError = function (status, responseText) {
    this.status = status;
    this.responseText = responseText;
};

var server = module.exports = function (method, action, data) {
    var url = "/api/" + action;
    if (data != null) {
        data = serialization.stringify(data);
    }
    return request(url, {
        method : method,
        data : data
    }).thenSync(function (response) {
        return serialization.parse(response);
    }, function (error) {
        var httpRequest = error.args ? error.args[1] : null;
        if (httpRequest) {
            var status = httpRequest.status;
            if (status == 0) {
                error = new ConnectionError();
            } else {
                var responseText = httpRequest.responseText;
                if (responseText) {
                    // Try to parse the response from the server as json:
                    try {
                        error = serialization.parse(responseText);
                    } catch (e) {
                        error = new UnknownError(status, responseText);
                    }
                } else {
                    error = new UnknownError(status, responseText);
                }
            }
        }
        var defer = promise.defer();
        defer.reject(error);
        return defer.promise;
    });
};

server.ConnectionError = ConnectionError;
server.UnknownError = UnknownError;
