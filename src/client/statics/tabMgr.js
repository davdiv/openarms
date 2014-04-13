var page = require("page");
var qs = require("qs");
var asyncRequire = require("noder-js/asyncRequire").create(module);
var routes = require("./routes");

var initTab = function (module) {
    this.module = module;
    this.template = module.template;
    // this.tabTemplate = module.tabTemplate; // temporarily disabled because of a bug in hashspace
    if (module.init) {
        return module.init(this);
    }
};

var stopProcessing = function () {
    this.processing = false;
};

var Tab = function (route, ctxt) {
    this.url = ctxt.canonicalPath;
    this.params = ctxt.params;
    this.query = qs.parse(ctxt.querystring);
    this.title = route.title;
    this.template = null;
    this.tabTemplate = null;
    this.processing = true;
    asyncRequire(route.module).thenSync(initTab.bind(this)).thenSync(stopProcessing.bind(this)).end();
};

var continueClosing = function (reallyClose) {
    if (reallyClose !== false) {
        this.remove();
    }
};

Tab.prototype.close = function () {
    if (module.close) {
        module.close(this).thenSync(continueClosing.bind(this)).end();
    } else {
        this.remove();
    }
};

var tabs = [];
var data = module.exports = {
    tabs : tabs,
    activeTab : null
};

Tab.prototype.remove = function () {
    var isActiveTab;
    var index = tabs.indexOf(this);
    if (index > -1) {
        tabs.splice(index, 1);
    }
    if (data.activeTab == this) {
        data.activeTab = null;
        if (index >= tabs.length) {
            index -= 1;
        }
        page(index < 0 ? "/" : tabs[index].url);
    }
};

var findTabWithUrl = function (url) {
    for (var i = 0, l = tabs.length; i < l; i++) {
        var curTab = tabs[i];
        if (curTab.url === url) {
            return curTab;
        }
    }
};

var insertTab = function (tabToInsert) {
    tabs.push(tabToInsert);
};

var processRoute = function (route) {
    return function (ctxt) {
        var url = ctxt.canonicalPath;
        var tab = findTabWithUrl(url);
        if (!tab) {
            tab = new Tab(route, ctxt);
            insertTab(tab);
        }
        data.activeTab = tab;
    };
};

routes.forEach(function (curRoute) {
    page(curRoute.path, processRoute(curRoute));
});

page();
