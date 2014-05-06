var klass = require("hsp/klass");
var Cache = require("./cache");
var server = require("./server");

var RestCache = klass({
    $constructor : function(basePath) {
        this.basePath = basePath;
        Cache.$constructor.call(this);
    },
    $extends : Cache,
    refreshContent : function(id) {
        return server("GET", this.basePath + "/" + id);
    },
    saveItemContent : function(object) {
        var response;
        var id = object.id;
        if (!id) {
            response = server("POST", this.basePath, object);
        } else {
            response = server("PUT", this.basePath + "/" + id, object);
        }
        return response.thenSync(this.setItemContent.bind(this));
    },
    search : function(query, options) {
        return server("POST", this.basePath + "/search", {
            query : query,
            options : options
        }).thenSync(this.setItemsContent.bind(this));
    }
});

module.exports = RestCache;