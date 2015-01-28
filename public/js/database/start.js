var nQ= window.nQ;
nQ.loadScripts(['js/shared/db-models.js', 'js/database/models.js','js/jquery-ui/jquery-ui.js','js/form-view.js', 'js/database/views.js', 'js/database/router.js'], function(){
    var databases = nQ.data.databases = new nQ.Databases();
    databases.fetch({success: function() {
        var router = nQ.app.router.subRouters['database'] = new nQ.DatabaseRouter();
        var databasesView = new nQ.DatabasesView({
            collection: databases
        });


        var layout = nQ.layout.database = new nQ.DatabaseLayout({
            template: 'database_layout',
            databasesView: databasesView
        });

        layout.addRegions({
            menu: '#menu',
            dbList: '#db-list',
            dbDetail: '#db-detail',
            footer: '#footer'
        });

        router.layout = layout;
        router.databases = databases;
    }});
 });
