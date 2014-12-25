/**
 * Created by ga on 23/12/14.
 */
var nQ= window.nQ;
var templates = window.templates;
var Backbone = window.Backbone, Marionette = Backbone.Marionette;
Marionette.Renderer.render = function (template, data) {
    return templates[template](data);
};


var app = nQ.app = new Marionette.Application({});
app.addRegions({
    body: 'body'
});
app.start();



var appRouter = new Backbone.Router({
    routes: {
        "database/:id": "getDatabase",
        "database" : "showDatabase",
        ":hash": "home"
    }
});

appRouter.on('route:getDatabase', function (id) {
    alert("Get database number " + id);
});
appRouter.on('route:showDatabase', function () {
    app.body.show(nQ.layout.database);
    for (var i = 11; i < 20; i++)
        nQ.data.databases.add({name: "after app start database " + i});
});
appRouter.on('route:home', function (hash) {
    alert(hash);
});
// Start Backbone history a necessary step for bookmarkable URL's
Backbone.history.start({silent:true});
nQ.loadScripts(['js/modules/database.js'], function() {
    console.log('database module loaded');
});
