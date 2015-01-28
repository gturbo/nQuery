var should = require('should')
var monetDb = require('../monetdb')

describe('test monetdb database object', function () {
    it('should connect to database', function (done) {
        var i = (new Date()).getTime()
        var z = Math.pow(2,63)-1
        console.log(i,z)
        vals = [i,z]
        vals.forEach(function(v) {
            h = hex(v)
            console.log(v,h)
        })
        done()
    });
});