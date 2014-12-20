var express = require('express');
var request = require('supertest');
var port = 0; //express.settings.port;
var app = require('../app.js');
var url = "http://localhost" + port ? ':' + port : '';


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
