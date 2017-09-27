var login = require("./login");

window.onbeforeunload = function (event) {
    if (login.isAuthenticated()) {
        var res = event.returnValue = "Cette opération va fermer Openarms et les éventuelles données non enregistrées seront perdues.";
        return res;
    }
};

login.done.then(function () {
    var pageMgr = require("./pageMgr");
    var main = require("./main.hsp.js");
    main(pageMgr).render(document.body.firstElementChild);
}, function () {
    var loginFailure = require("./loginFailure.hsp.js");
    loginFailure("Erreur d'initialisation!").render(document.body);
});
