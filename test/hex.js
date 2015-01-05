var should = require('should');

var hex = function(n) {
    return Number(n).toString(32);
}

describe('test hex functions', function () {
    it('should convert to hex', function (done) {
        var i = (new Date()).getTime();
        var z = Math.pow(2,63)-1
        console.log(i,z)
        vals = [i,z]
        vals.forEach(function(v) {
            h = hex(v)
            console.log(v,h)
        })
        done();
    });
});