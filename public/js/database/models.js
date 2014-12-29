var nQ= window.nQ;
nQ.Database = Backbone.Model.extend({
    defaults: {dbType: 'monetdb'},
    type: 'database'
});
nQ.Databases = Backbone.Collection.extend({
    model: nQ.Database,
    url: '/db/database'
});
