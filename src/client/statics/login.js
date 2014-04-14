var promise = require("noder-js/promise");
var json = require("hsp/json");

var login = module.exports = {
    data : {
        sessionId : null,
        userDisplayName : "",
        userLogin : "",
        userId : "",
        connected : false
    },
    login : function (credentials) {
        // TODO: replace this with a server call
        setLoginData({
            sessionId : null,
            userDisplayName : credentials.login,
            userLogin : credentials.login,
            userId : "",
            connected : true
        });
        return promise.done;
    },
    logout : function () {
        // TODO: replace this with a server call
        setLoginData({
            sessionId : null,
            userDisplayName : "",
            userLogin : login.data.userLogin,
            userId : "",
            connected : false
        });
        return promise.done;
    }
};

var setLoginData = function (loginData) {
    login.data = loginData;
    var strLoginData = JSON.stringify({
        sessionId : loginData.sessionId,
        userDisplayName : loginData.userDisplayName,
        userLogin : loginData.userLogin,
        userId : loginData.userId,
        connected : loginData.connected
    });
    localStorage.setItem("login", strLoginData);
};

var onStorageEvent = function () {
    var strLoginData = localStorage.getItem("login");
    if (strLoginData) {
        login.data = JSON.parse(strLoginData);
    }
};

window.addEventListener('storage', onStorageEvent, false);
onStorageEvent();
