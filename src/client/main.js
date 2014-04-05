var page = require("page");
var routes = require("./routes");
var asyncRequire = require("noder-js/asyncRequire").create(module);
var qs = require("qs");
var routeData = {};

var processRoute = function (route) {
    return function (ctxt) {
        routeData.component = null;
        routeData.params = ctxt.params;
        routeData.query = qs.parse(ctxt.querystring);
        routeData.hash = ctxt.hash;
        asyncRequire(route.component).thenSync(function (componentModule) {
            routeData.component = componentModule;
        });
    };
};

routes.forEach(function (curRoute) {
    page(curRoute.path, processRoute(curRoute));
});

page();

var main = require("./main.hsp.js");
main(routeData).render(document.body);
