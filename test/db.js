process.env.NODE_APP_INSTANCE = 'test';
var os = require('os');
describe('test database functions', function () {
    var db = require('../database');
    it('should be a test database in temp dir', function (done) {
        var err;
        if (db.location.indexOf(os.tmpdir()))
            err = new Error('using not temporary database for tests');
        //console.log(db);
        done(err);
    });
    it('should delete all database', function (done) {
        var key = db.getKey('a', 'fakekey');
        db.put(key, 'toto', function () {
            db.deleteAll(null, function () {
                db.get(key, function (err, val) {
                    if (err.notFound)
                        done();
                    else {
                        if (!err)
                            err = new Error('key a:fakekey not deleted');
                        done(err);
                    }
                })
            })
        })
    });
    it('should delete all keys from type', function (done) {
        var key = db.getKey('a', 'fakekey');
        db.put(key, 'toto', function () {
            db.deleteAll('a', function () {
                db.get(key, function (err, val) {
                    if (err.notFound)
                        done();
                    else {
                        if (!err)
                            err = new Error('key a:fakekey not deleted');
                        done(err);
                    }
                })
            })
        })
    });
});