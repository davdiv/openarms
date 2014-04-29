var Cache = require("./cache");

var cacheInstance = new Cache(function(id) {
    return {
        id : id
    };
});

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
    }
};
