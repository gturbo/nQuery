var request = require('supertest');
var app = require('../app.js');


describe('test crud persistence', function () {
    var id=1;
    it('should be empty', function(done) {
       request(app)
           .get('/db/test/' + id)
           .expect(404)
           .end(done);
    });
    it('should store an object', function (done) {
        request(app)
            .post("/db/test").send({name:'titi'})
            .expect(200)
            .expect('LastInsertId', /^\d+$/)
            .expect(function(res) {
                id = res.get('LastInsertId');
            })
            .end(done);
    });
    it('should not be empty any more', function(done) {
        request(app)
            .get('/db/test/' + id)
            .expect(200)
            .expect(function(res) {
                console.log('response:', JSON.stringify(res));
                var obj = JSON.parse(res.text);
                var ok = (obj.name == 'titi');
                return !ok;
            })
            .end(done);
    });
    it('should be deletable', function(done) {
        request(app)
            .delete('/db/test/' + id)
            .expect(200)
            .end(done);
    });
    it('should not be avail, able once deleted', function(done) {
        request(app)
            .get('/db/test/' + id)
            .expect(404)
            .end(done);
    })
})
