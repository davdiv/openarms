var RestCache = require("./restCache");
var server = require("./server");

var cacheInstance = new RestCache("people");

// Fill the cache with some people (for demo purposes):
cacheInstance.setItemContent({id:"pierredupont",firstName:"Pierre",sex:"male",lastName:"Dupont"});
cacheInstance.setItemContent({id:"mariedurand",firstName:"Marie",lastName:"Durand", sex:"female"});

module.exports = {
    refreshItemContent : cacheInstance.refreshItemContent.bind(cacheInstance),
    refreshIdentity : cacheInstance.refreshItemContent.bind(cacheInstance),
    getItemContent : cacheInstance.getItemContent.bind(cacheInstance),
    getIdentity : cacheInstance.getItemContent.bind(cacheInstance),
    saveIdentity : cacheInstance.saveItemContent.bind(cacheInstance),
    saveItemContent : cacheInstance.saveItemContent.bind(cacheInstance),
    search : function(text) {
        // TODO: request the server instead of looking in the cache
        var res = [];
        var items = cacheInstance.items;
        for ( var key in items) {
            if (items.hasOwnProperty(key)) {
                var curItem = items[key];
                if (curItem.content) {
                    res.push(curItem.content.id);
                }
            }
        }
        return res;
    }
};
