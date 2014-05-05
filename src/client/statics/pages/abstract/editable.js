var klass = require("hsp/klass");
var promise = require("noder-js/promise");

module.exports = klass({
    cache : null,
    init : function(page) {
        this.page = page;
        var id = page.params.id;
        if (id === "new") {
            this.savedData = null;
            this.editedData = this.createData(page.query);
            this.currentView = "edit";

            page.query = {
                id : new Date().getTime()
            };
            page.updateUrl();
        } else {
            this.savedData = this.loadData(id);
            this.editedData = null;
        }
    },
    createData : function(query) {
        return {};
    },
    loadData : function(id) {
        if (this.cache) {
            return this.cache.getItemContent(id);
        } else {
            return {
                id : id
            };
        }
    },
    saveData : function(data) {
        if (this.cache) {
            return this.cache.saveItemContent(data);
        } else {
            return data;
        }
    },
    refreshData : function(id) {
        if (this.cache) {
            return this.cache.refreshItemContent(id);
        } else {
            return this.loadData(id);
        }
    },
    onUserRefresh : function(event) {
        event.returnValue = this.refreshData(this.page.params.id);
    },
    onUserSave : function(event) {
        var page = this.page;
        var res = event.returnValue = promise.done.thenSync(this.saveData.bind(this, this.editedData));
        res.thenSync(function(res) {
            page.params.id = res.id;
            page.query = {};
            page.updateUrl();
        });
    },
    onUserCancel : function() {
        if (!this.savedData) {
            this.page.$dispose();
        }
    },
    close : function() {
        if (this.editedData) {
            return confirm("Cette page peut contenir des données non enregistrées qui seront perdues si elle est fermée. Êtes-vous sûr(e) de vouloir la fermer?");
        }
    }
});