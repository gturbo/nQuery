process.env.NODE_APP_INSTANCE = 'test';
var os = require('os');
var should = require('should');

describe('test database functions', function () {
    var db = require('../database');
    it('should be a test database in temp dir', function (done) {
        var err;
        if (db.location().indexOf(os.tmpdir()))
            err = new Error('using not temporary database for tests');
        //console.log(db);
        done(err);
    });
    it('should delete all database', function (done) {
        db.put('a', 'fakekey', 'toto', function () {
            db.deleteAll(null, function () {
                db.get('a', 'fakekey', function (err, val) {
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
        db.put('a', 'fakekey', 'toto', function () {
            db.deleteAll('a', function () {
                db.get('a', 'fakekey', function (err, val) {
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
    it('should return some elements collections', function (done) {
        var batch = db.batch()
        for (var i = 0; i < 10; i++) {
            batch.put('b', i, {id: i})
        }
        batch.write(function (err) {
            var col = []
            db.createColReadStream('b', {start: 0, end: 5})
                .on('data', function (data) {
                    col.push(data)
                })
                .on('error', function (err) {
                    console.log(err)
                })
                .on('end', function () {
                    col.length.should.equal(6)
                    done()
                })
        })
    });
});