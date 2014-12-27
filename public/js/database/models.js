var nQ= window.nQ;
nQ.Database = Backbone.Model.extend({});
nQ.Databases = Backbone.Collection.extend({
    model: nQ.Database
});
