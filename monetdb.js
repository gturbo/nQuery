var conf = require('config');var util = require('util');
var monetdb = require('monetdb');
var metaDb = require('db');
var Backbone = require('public/js/')
var DB_COL = "database";

function errorHandler(err) {
    if (err) {
        console.log(err);
    }
    return (!err);
}



router.get('/test-con/:dbId', function (req, res) {

    metaDb.get()
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
});

