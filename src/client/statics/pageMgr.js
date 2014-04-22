var pagejs = require("page");
var qs = require("qs");
var asyncRequire = require("noder-js/asyncRequire").create(module);
var routes = require("./routes");

var initPage = function (module) {
    this.module = module;
    this.template = module.template;
    this.iconTemplate = module.iconTemplate;
    if (module.init) {
        return module.init(this);
    }
};

var stopProcessing = function () {
    this.processing = false;
};

var replaceUrl = function (oldUrl, newUrl) {
    setTimeout(function () {
        var url = location.pathname + location.search + location.hash;
        if (url == oldUrl) {
            pagejs.replace(newUrl);
        }
    }, 1);
};

var Page = function (route, ctxt) {
    this.url = ctxt.canonicalPath;
    this.params = ctxt.params;
    this.query = qs.parse(ctxt.querystring);
    this.title = route.title;
    this.template = null;
    this.iconTemplate = null;
    this.processing = true;
    asyncRequire(route.module).thenSync(initPage.bind(this)).thenSync(stopProcessing.bind(this)).end();
};

var continueClosing = function (reallyClose) {
    if (reallyClose !== false) {
        this.remove();
    }
};

Page.prototype.close = function () {
    if (module.close) {
        module.close(this).thenSync(continueClosing.bind(this)).end();
    } else {
        this.remove();
    }
};

var pages = [];
var data = module.exports = {
    pages : pages,
    activePage : null
};

Page.prototype.remove = function () {
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
};

Page.prototype.setQuery = function (newQuery) {
    var oldUrl = this.url;
    var newQueryString = qs.stringify(newQuery);
    if (newQueryString) {
        newQueryString = "?" + newQueryString;
    }
    var newUrl = oldUrl.replace(/(?:\?[^#]*)?(?=#|$)/, newQueryString);
    this.query = newQuery;
    this.url = newUrl;

    replaceUrl(oldUrl, newUrl);
};

var findPageWithUrl = function (url) {
    for (var i = 0, l = pages.length; i < l; i++) {
        var curPage = pages[i];
        if (curPage.url === url) {
            return curPage;
        }
    }
};

var insertPage = function (pageToInsert) {
    pages.push(pageToInsert);
};

var processRoute = function (route) {
    return function (ctxt) {
        var url = ctxt.canonicalPath;
        var page = findPageWithUrl(url);
        if (!page) {
            page = new Page(route, ctxt);
            insertPage(page);
        }
        data.activePage = page;
    };
};

routes.forEach(function (curRoute) {
    pagejs(curRoute.path, processRoute(curRoute));
});

pagejs();
