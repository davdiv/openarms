var tabMgr = require("./tabMgr");
var main = require("./main.hsp.js");
main(tabMgr).render(document.body);

window.onbeforeunload = function (event) {
    var res = event.returnValue = "Cette opération va fermer Openarms et les éventuelles données non enregistrées seront perdues.";
    return res;
};
