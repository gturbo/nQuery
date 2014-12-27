var request = require('supertest');
var app = require('../app.js');


describe('test home page generation', function () {
    it('should respond with html home page', function (done) {
        request(app)
            .get("/")
            .expect(200)
            .expect('Content-Type', /\/html/)
            .expect(/^<!DOCTYPE html>/)
            .end(done);
    })
})
