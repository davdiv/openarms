var klass = require("hsp/klass");
var pagejs = require("page");
var qs = require("qs");
var asyncRequire = require("noder-js/asyncRequire").create(module);
var routes = require("./routes");

var pages = [];
var data = module.exports = {
    pages : pages,
    activePage : null
};

var insertPage = function(pageToInsert) {
    pages.push(pageToInsert);
};

var initPage = function(ModuleCstr) {
    var controller = new ModuleCstr(this);
    this.controller = controller;
    if (controller.init) {
        return controller.init(this);
    }
};

var stopProcessing = function() {
    this.processing = false;
};

var continueClosing = function(reallyClose) {
    if (reallyClose !== false) {
        this.$dispose();
    }
};

var updateUrl = function() {
    if (data.activePage == this) {
        pagejs.replace(this.url);
    }
};

var Page = klass({
    $constructor : function(route, ctxt) {
        this.url = ctxt.canonicalPath;
        this.urlPattern = route.path;
        this.params = ctxt.params;
        this.query = qs.parse(ctxt.querystring);
        this.title = route.title;
        this.processing = true;
        this.controller = null;
        insertPage(this);
        asyncRequire(route.module).thenSync(initPage.bind(this)).thenSync(stopProcessing.bind(this)).end();
    },
    $dispose : function() {
        var controller = this.controller;
        if (controller.$dispose) {
            controller.$dispose();
        }
        var index = pages.indexOf(this);
        if (index > -1) {
            pages.splice(index, 1);
        }
        if (data.activePage == this) {
            data.activePage = null;
            if (index >= pages.length) {
                index -= 1;
            }
            pagejs(index < 0 ? "/" : pages[index].url);
        }
    },
    close : function() {
        var controller = this.controller;
        if (controller.close) {
            controller.close().thenSync(continueClosing.bind(this)).end();
        } else {
            this.$dispose();
        }
    },
    updateUrl : function() {
        var urlPattern = this.urlPattern;
        var params = this.params;
        for ( var p in params) {
            if (params.hasOwnProperty(p)) {
                urlPattern = urlPattern.replace(":" + p, params[p]);
            }
        }
        var queryString = qs.stringify(this.query);
        if (queryString) {
            urlPattern += "?" + queryString;
        }
        this.url = urlPattern;
        setTimeout(updateUrl.bind(this), 1);
    }
});

var findPageWithUrl = function(url) {
    for ( var i = 0, l = pages.length; i < l; i++) {
        var curPage = pages[i];
        if (curPage.url === url) {
            return curPage;
        }
    }
};

var processRoute = function(route) {
    return function(ctxt) {
        var url = ctxt.canonicalPath;
        var page = findPageWithUrl(url);
        if (!page) {
            page = new Page(route, ctxt);
        }
        data.activePage = page;
    };
};

routes.forEach(function(curRoute) {
    pagejs(curRoute.path, processRoute(curRoute));
});

pagejs();
