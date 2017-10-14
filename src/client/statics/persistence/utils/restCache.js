var Promise = require("noder-js/promise");
var klass = require("hsp/klass");
var Cache = require("./cache");
var server = require("./server");
var login = require("../../login");

var RestCache = klass({
    $constructor : function (basePath) {
        this.basePath = basePath;
        Cache.$constructor.call(this);
    },
    $extends : Cache,
    readRole : undefined,
    writeRole : undefined,
    refreshContent : function (id) {
        if (!this.canRead()) {
            return Promise.reject(new login.AuthenticationError("Vous ne pouvez pas accéder à ce document."));
        }
        return server("GET", this.basePath + "/" + id);
    },
    canSave : function () {
        return login.hasRole(this.writeRole);
    },
    canRead : function () {
        return login.hasRole(this.readRole);
    },
    removeItem : function (object) {
        if (!this.canSave()) {
            return Promise.reject(new login.AuthenticationError("Vous ne pouvez pas supprimer ce document."));
        }
        var response = server("DELETE", this.basePath + "/" + object.id + "?lastChangeTimestamp=" + encodeURIComponent(object.lastChangeTimestamp.getTime()));
        return response;
    },
    saveItemContent : function (object) {
        if (!this.canSave()) {
            return Promise.reject(new login.AuthenticationError("Vous ne pouvez pas enregistrer ce document."));
        }
        var response;
        var id = object.id;
        if (!id) {
            response = server("POST", this.basePath, object);
        } else {
            response = server("PUT", this.basePath + "/" + id, object);
        }
        return response.thenSync(this.setItemContent.bind(this));
    },
    search : function (query, options) {
        return server("POST", this.basePath + "/search", {
            query : query,
            options : options
        }).thenSync(this.setItemsContent.bind(this));
    },
    suggestions : function (query) {
        return server("GET", this.basePath + "/suggestions?q=" + encodeURIComponent(query)).thenSync(
            this.setItemsContent.bind(this));
    }
});

module.exports = RestCache;