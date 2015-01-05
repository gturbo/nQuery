var conf = require('config');
var manager = require(conf.db.type);


// open a data store
var db = manager(conf.db.url);
var sep = '\x00';
var end = '\x00\xFF';


var Db = function (_db) {
    var _nextId = Date.now();
    var _getKey = function(type, id) {
        return type + sep + id;
    }
    var _getNextId = function() {
        return _nextId++;
    }
    var Batch = function() {
        var _batch = _db.batch()
        return {
            put: function(col, id, val) {
                _batch.put(_getKey(col, id), JSON.stringify(val));
                return this;
            }
            ,del: function(col, id) {
                _batch.del(_getKey(col, id));
                return this;
            }
            ,write: function(next) {
                return _batch.write(next)
            }
        }
    }

    return {
        location: function() {
            return _db.location;
        }
        ,get: function (col, id, next) {
            _db.get(_getKey(col, id), next)
        }
        ,put: function (col, id, value, next) {
            var create = (id === null || id === undefined)
            if (create){
                id = _getNextId()
                value.id = id
            }
            _db.put(_getKey(col, id), JSON.stringify(value), function(err) {
                next(err,id);
            })
        }
        , del: function (col, id, next) {
            _db.del(_getKey(col, id), next)
        }
        , createReadStream: function () {
            return _db.createReadStream(arguments);
        }
        , createColReadStream: function (col, params) {
            if (params) {
                var id = NaN;
                if (params.start) {
                    var id = Number(params.start)
                }
                params.start = col + sep + (isNaN(id) ? '' : id)
                id = NaN
                if (params.end) {
                    var id = Number(params.end)
                }
                params.end = col + (isNaN(id) ? end : sep + id)
            } else
                params = {
                    start: col
                    , end: col + end
                    , keys: true          // see db.createKeyStream()
                    , values: true          // see db.createValueStream()
                }
            console.log(params)
            return _db.createReadStream(params);
        }
        , deleteAll: function (type, done) {
            if (!type) {
                console.log('deleting whole database');
                _db.close(function (err) {
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
                                _db.open(done);
                        })
                    }
                });
            } else {
                db.createReadStream({
                    start: type
                    , end: type + end
                    , keys: true          // see db.createKeyStream()
                    , values: false          // see db.createValueStream()
                })
                    .on('data', function (key) {
                        _db.del(key);
                    })
                    .on('error', function (err) {
                        done(err);
                    })
                    .on('end', done);
            }
        }
        ,batch: function() {
            return Batch();
        }
    }
}


module.exports = Db(db);