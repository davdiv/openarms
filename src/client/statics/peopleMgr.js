var Cache = require("./cache");

var cacheInstance = new Cache(function(id) {
    // TODO: request the server
    return {
        id : id
    };
});

// Fill the cache with some people (for demo purposes):
cacheInstance.setItemContent({id:"pierredupont",firstName:"Pierre",sex:"male",lastName:"Dupont"});
cacheInstance.setItemContent({id:"mariedurand",firstName:"Marie",lastName:"Durand", sex:"female"});

module.exports = {
    refreshIdentity : cacheInstance.refreshItemContent.bind(cacheInstance),
    getIdentity : cacheInstance.getItemContent.bind(cacheInstance),
    saveIdentity : function(object) {
        if (!cacheInstance.getId(object)) {
            // new person
            object.id = new Date().getTime();
        }
        // existing person
        return cacheInstance.setItemContent(object);
    },
    search: function (text) {
        // TODO: request the server instead of looking in the cache
        var res = [];
        var items = cacheInstance.items;
        for (var key in items) {
            if (items.hasOwnProperty(key)) {
                var curItem = items[key];
                if (curItem.content) {
                    res.push(curItem.content);
                }
            }
        }
        return res;
    }
};
