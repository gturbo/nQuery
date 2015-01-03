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
var globalCh = Backbone.Wreqr.radio.channel('global');
var vent = globalCh.vent;
app.start();
var router = app.router = new nQ.Router();

// Start Backbone history a necessary step for bookmarkable URL's
Backbone.history.start();
// start init module
if (location.hash.match(/^[/]?$/))
    location.hash='database';