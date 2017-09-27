var Promise = require("noder-js/promise");
var Keycloak = require('keycloak');
var keycloakInstance = exports.keycloak = Keycloak('/keycloak.json');

var AuthenticationError = exports.AuthenticationError = function(message) {
    this.message = message;
};

exports.done = new Promise(function (resolve, reject) {
    keycloakInstance.init({ onLoad: 'login-required' }).success(resolve).error(reject);
}).then(function () {
    exports.userDisplayName = keycloakInstance.tokenParsed.name;
}, function () {
    return Promise.reject(new AuthenticationError("L'authentification a échoué!"));
});

exports.logout = function() {
    keycloakInstance.logout();
};

exports.manageAccount = function() {
    var url = keycloakInstance.createAccountUrl();
    var newWindow = window.open();
    newWindow.opener = null;
    newWindow.location = url;
};

exports.getToken = function () {
    return new Promise(function (resolve, reject) {
        keycloakInstance.updateToken(30).success(resolve).error(reject);
    }).then(function () {
        return keycloakInstance.token;
    }, function () {
        return Promise.reject(new AuthenticationError("Vous avez été déconnecté(e)!"));
    });
};

exports.isAuthenticated = function () {
    return keycloakInstance.authenticated;
};