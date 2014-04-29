var promise = require("noder-js/promise");
var updateObject = require("./updateObject");

var Item = function(id) {
    this.id = id;
    this.content = null;
    this.savedContent = {};
    this.contentRequested = false;
    this.setError = this.setError.bind(this);
    this.setContent = this.setContent.bind(this);
    this.defer = null;
    this.promise = null;
};

Item.prototype.setError = function() {
    this.content = null;
    var defer = this.defer || promise.defer();
    defer.reject.apply(defer, arguments);
    this.defer = null;
    this.promise = defer.promise;
    this.contentRequested = false;
    return this.promise;
};

Item.prototype.setContent = function(value) {
    if (!value) {
        return this.setError(new Error("setValue called with no value!"));
    }
    var savedContent = this.savedContent;
    updateObject(savedContent, value);
    this.content = savedContent;
    if (this.defer) {
        this.defer.resolve(savedContent);
        this.defer = null;
    }
    this.promise = null;
    this.contentRequested = false;
    return savedContent;
};

Item.prototype.getContent = function() {
    var res = this.content || this.promise;
    if (!res) {
        var defer = this.defer = promise.defer();
        this.promise = defer.promise();
    }
    return res;
};

Item.prototype.markContentRequested = function() {
    this.contentRequested = true;
};

Item.prototype.isRequestNeeded = function() {
    return !(this.content || (this.promise && this.promise.isRejected()) || this.contentRequested);
};

var defaultGetId = function(object) {
    return object.id;
};

var Cache = function(refreshContent, getId) {
    this.items = {};
    this.getId = (getId || defaultGetId).bind(null);
    this.refreshContent = refreshContent.bind(null);
};

var refreshItem = function(cache, curItem) {
    curItem.markContentRequested();
    var newPromise = promise.done.thenSync(cache.refreshContent.bind(cache, curItem.id));
    return newPromise.thenSync(curItem.setContent, curItem.setError);
};

Cache.prototype.getItem = function(id) {
    var curItem = this.items[id];
    if (!curItem) {
        curItem = this.items[id] = new Item(id);
    }
    return curItem;
};

Cache.prototype.getItemContent = function(id) {
    var curItem = this.getItem(id);
    if (curItem.isRequestNeeded()) {
        refreshItem(this, curItem);
    }
    return curItem.getContent();
};

Cache.prototype.refreshItemContent = function(id) {
    var curItem = this.getItem(id);
    return refreshItem(this, curItem);
};

Cache.prototype.setItemContent = function(object) {
    var id = this.getId(object);
    if (!id) {
        throw new Error("Trying to set an item without id.");
    }
    var curItem = this.getItem(id);
    return curItem.setContent(object);
};

Cache.prototype.setItemError = function(id, error) {
    var curItem = this.getItem(id);
    return curItem.setError(error);
};

module.exports = Cache;
