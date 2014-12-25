var nQ= window.nQ;
nQ.loadScripts(['js/models/database.js', 'js/views/database.js'], function(){
    var databases = nQ.data.databases = new nQ.Databases();
//databases.fetch();

   var databasesView = new nQ.DatabasesView({
        collection: databases
    });

    var DatabaseLayout = Marionette.LayoutView.extend({
        onShow: function() {
            this.content.show(databasesView);
        }
    });

    var layout = nQ.layout.database = new DatabaseLayout({
        template: 'database_layout'
    });

    layout.addRegions({
        menu: '#menu',
        content: '#content',
        footer: '#footer'
    });

    window.location.hash = 'database';
    for (var i = 0; i < 10; i++)
        databases.add({name: "fake database " + i});
});
