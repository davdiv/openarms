var Promise = require("noder-js/promise");
var Keycloak = require('keycloak');
var keycloakInstance = exports.keycloak = Keycloak('/keycloak.json');
var split = require("utils/splitField");

var AuthenticationError = exports.AuthenticationError = function(message) {
    this.message = message;
};

exports.done = new Promise(function (resolve, reject) {
    keycloakInstance.init({ onLoad: 'login-required' }).success(resolve).error(reject);
}).then(function () {
    var tokenParsed = keycloakInstance.tokenParsed;
    exports.userDisplayName = tokenParsed.name;
    exports.banknotesPrinters = split(tokenParsed.banknotesPrinters);
    exports.coinsPrinters = split(tokenParsed.coinsPrinters);
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

exports.hasRole = function (role) {
    return keycloakInstance.hasResourceRole(role, "assocomptes");
};