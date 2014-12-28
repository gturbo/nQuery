var nQ= window.nQ;
nQ.loadScripts(['js/database/models.js', 'js/database/views.js', 'js/database/router.js'], function(){
    var databases = nQ.data.databases = new nQ.Databases();
//databases.fetch();
    var router = nQ.app.router.subRouters['database'] = new nQ.DatabaseRouter();
   var databasesView = new nQ.DatabasesView({
        collection: databases
    });

    var DatabaseLayout = Marionette.LayoutView.extend({
        onShow: function() {
            this.dbList.show(databasesView);
        }
    });

    var layout = nQ.layout.database = new DatabaseLayout({
        template: 'database_layout'
    });

    layout.addRegions({
        menu: '#menu',
        dbList: '#db-list',
        dbDetail: '#db-detail',
        footer: '#footer'
    });

    window.location.hash = 'database';
    for (var i = 0; i < 10; i++)
        databases.add({name: "fake database " + i});
});
