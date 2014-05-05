var request = require("noder-js/request");
var serialization = require("./serialization");
var promise = require("noder-js/promise");

module.exports = function(method, action, data) {
    var url = "/api/" + action;
    if (data != null) {
        data = serialization.stringify(data);
    }
    return request(url, {
        method : method,
        data : data
    }).thenSync(function(response) {
        return serialization.parse(response);
    }, function(error) {
        var httpRequest = error.args ? error.args[1] : null;
        if (httpRequest) {
            if (httpRequest.status == 0) {
                error = "La connexion au serveur a échoué.";
            } else if (httpRequest.responseText) {
                error = httpRequest.responseText;
            } else {
                error = "Une erreur inconnue s'est produite sur le serveur.";
            }
        }
        var defer = promise.defer();
        defer.reject(error);
        return defer.promise;
    });
};
