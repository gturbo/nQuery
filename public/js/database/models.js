var nQ= window.nQ;
nQ.Database = nQ.Database.extend(_.extend(nQ.DatabaseExtend, nQ.MetaModelExtend, {
    defaults: {dbType: 'monetdb'},
    type: 'database'
}));

nQ.Databases = Backbone.Collection.extend({
    model: nQ.Database,
    url: '/db/database'
});
