var conf = require('config');
var manager = require(conf.db.type);

// open a data store
var db = manager(conf.db.url);
var sep = db.sep = '\x00';
db.end = '\x00\xFF';
var _nextId = Date.now();
db.getId = function () {
    return _nextId++;
};
db.getKey = function (type, id) {
    return type + sep + id;
};
db.deleteAll = function (type, done) {
    if (!type) {
        console.log('deleting whole database');
        db.close(function (err) {
            if (err) {
                console.log('error closing database ' + err);
                done(err);
            } else {
                var leveldown = require('leveldown');
                leveldown.destroy(conf.db.url, function (err) {
                    if (err) {
                        console.log('error destroying database ' + err);
                        done(err);
                    }
                    else
                        db.open(done);
                })
            }
        });
    } else {
        db.createReadStream({
            start     : type
            , end       : type+db.end
            , keys      : true          // see db.createKeyStream()
            , values    : false          // see db.createValueStream()
        })
            .on('data', function(key){db.del(key); })
            .on('error', function(err) { done(err); })
            .on('end', done);
    }
};

module.exports = db;