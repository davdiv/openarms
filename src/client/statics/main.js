var pageMgr = require("./pageMgr");
var main = require("./main.hsp.js");
main(pageMgr).render(document.body);

window.onbeforeunload = function (event) {
    var res = event.returnValue = "Cette opération va fermer Openarms et les éventuelles données non enregistrées seront perdues.";
    return res;
};
