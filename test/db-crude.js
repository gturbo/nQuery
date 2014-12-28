process.env.NODE_APP_INSTANCE = 'test';
var request = require('supertest');
var app = require('../app.js');
var db = require('../database');
var should = require('should');

describe('test crud persistence', function () {

    var id = 1;
    it('should be empty', function (done) {
        request(app)
            .get('/db/test/' + id)
            .expect(404)
            .end(done);
    });
    it('should store an object', function (done) {
        request(app)
            .post("/db/test").send({name: 'titi'})
            .expect(200)
            .expect(function (res) {
                console.log('response:' + res.text + '\n');
                var o = JSON.parse(res.text);
                id = o.id;
                o.should.have.property('id');
            })
            .end(done);
    });
    it('should not be empty any more', function (done) {
        request(app)
            .get('/db/test/' + id)
            .expect(200)
            .expect(function (res) {
                console.log('response:' + res.text + '\n');
                var obj = JSON.parse(res.text);
                obj.should.have.property('name', 'titi');
            })
            .end(done);
    });
    it('should return collections', function (done) {
        var batch = db.batch();
        for (var i=0;i<10;i++) {
            batch.put(db.getKey('a', i), '{"id":' + i +'}');
        }
        batch.write(function(err) {
            if (err)
                done(err);
            else {
                request(app)
                    .get('/db/a')
                    .expect(200)
                    .expect(function (res) {
                        console.log(res.text +'\n');
                        var objs = JSON.parse(res.text);
                        objs.should.be.an.Array;
                        (objs.length).should.equal(10);
                    })
                    .end(done);
            }
        });
    });
    it('should be deletable', function (done) {
        request(app)
            .delete('/db/test/' + id)
            .expect(200)
            .end(done);
    });
    it('should not be avail, able once deleted', function (done) {
        request(app)
            .get('/db/test/' + id)
            .expect(404)
            .end(done);
    });
});
