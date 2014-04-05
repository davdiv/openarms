var page = require("page");
var routes = require("./routes");
var asyncRequire = require("noder-js/asyncRequire").create(module);
var routeData = {};

var processRoute = function (route) {
    return function (ctxt) {
        routeData.component = null;
        routeData.data = null;
        asyncRequire(route.component).thenSync(function (componentModule) {
            routeData.component = componentModule;
            routeData.params = ctxt.params;
        });
    };
};

routes.forEach(function (curRoute) {
    page(curRoute.path, processRoute(curRoute));
});

page();

var main = require("./main.hsp.js");
main(routeData).render(document.body);
