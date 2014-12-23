/**
 * Created by ga on 20/12/14.
 */
var templates = window.templates;
var Backbone = window.Backbone, Marionette = Backbone.Marionette;
Marionette.Renderer.render = function (template, data) {
    return templates[template](data);
};
var Database = Backbone.Model.extend({});
var Databases = Backbone.Collection.extend({
    model: Database
});
var databases = new Databases();
//databases.fetch();
var app = new Marionette.Application({databases: databases});

app.addRegions({
    body: 'body',
    menu: '#menu',
    content: '#content',
    footer: '#footer'
});

var DatabaseView = Marionette.ItemView.extend({
    tagName: 'tr',
    template: 'database_table',
    className: 'databaseTable'
});

var DbView = Marionette.CollectionView.extend({
        tagName: 'div',
        template: 'databases_table',
        childView: DatabaseView
    }),
    dbView = new DbView({
        collection: databases
    });
app.addInitializer(function (options) {
    app.content.show(dbView);
});
app.start();

for (var i = 0; i < 10; i++)
    databases.add({name: "fake database " + i});

console.log("done start");

