var klass = require("hsp/klass");
var RestCache = require("./restCache");

var PeopleCache = klass({
    $extends : RestCache,
    $constructor : function() {
        RestCache.$constructor.call(this, "people");
    },
    search : function(text) {
        // TODO: request the server instead of looking in the cache
        var res = [];
        var items = this.items;
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
});

module.exports = new PeopleCache();
