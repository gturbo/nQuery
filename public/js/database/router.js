nQ.DatabaseRouter = nQ.SubRouter.extend({
    routes: {
        "null" : "home",
        "/" : "home",
        "/:id": "getDatabase",
        "*hash": "test"
    },
    getDatabase: function(id) {
        if(id=="new_database") {
            var db = new nQ.Database();
            this.layout.dbDetail.show(new nQ.DatabaseDetailView({
                model: db
            }));
            this.layout.dbList.currentView.unselect();
        } else {
            var db = this.databases.get(id);
            if (db) {
                this.layout.dbList.currentView.select(id);
                this.layout.dbDetail.show(new nQ.DatabaseDetailView({
                    model: db
                }));
            }
            else {
                this.layout.dbList.currentView.unselect();
                this.layout.dbDetail.show(new Backbone.Marionette.ItemView({
                    template: 'database_not_found'
                }))
            }
        }
        $('#footer').html('<b>Get database number ' + id + '</b>');
    },
    test: function(hash) {
        this.layout.dbList.currentView.unselect();
        this.layout.dbDetail.empty();
        $('#footer').html('<b>undefined route ' + hash + '</b>');
    },
    home: function() {
        this.layout.dbList.currentView.unselect();
        this.layout.dbDetail.show(new Backbone.Marionette.ItemView({template: 'database_home'}));
    }

})