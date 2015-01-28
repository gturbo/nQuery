var conf = require('config');var util = require('util')
var monetdb = require('monetdb')
var metaDb = require('db');
var _ = require('underscore-node.js')
var Backbone = require('public/js/')
var DB_COL = "database";
var models = require('public/shared/db-models')

function errorHandler(err) {
    if (err) {
        console.log(err);
    }
    return (!err);
}
var Column = models.Column

var Columns = models.Columns

var Table = models.Table

var Tables = models.Tables


var MonetDB = Backbone.Model.extend(_.extend(models.DatabaseExtend,{
    initialyze: function() {

    }
    ,url: "database"
    ,connect: function(done) {
        if (this.connection)
            done(this.connection)
        else {
            this.connection = monetdb.connect(done);
        }
    }
    ,disconnect: function(done) {
        if (this.connection) {
            this.connection.disconnect(done);
        } else
            done()
        delete this.connection;
    }
    ,query: function(sql, done) {
        this.connect(function(err) {
            if (err) {
                console.log("error connecting to database")
            }
        }).query()
    }
}))


module.exports = {

    metaDb.get(id)
    ,models: models
    var options = {
        host: 'localhost',
        port: 50000,
        dbname: 'voc',
        user: 'monetdb',
        password: 'monetdb'
    };
    var conn;
    conn = monetdb.connect(options, function (err) {
        if (errorHandler(err)) {
            conn.query('select k.id, t.name as "table", k.name, k.rkey, k."action" ' +
                'from sys.keys k ' +
                'left join sys.tables t on k.table_id = t.id',
                function (err, mRes) {
                    if (error(res, err)) {
                        //res.status(200).send(util.inspect(mRes));
                        res.status(200).send(mRes);
                    }
                })

        }

    })

    connect: function(db) {

    }


}

