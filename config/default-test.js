/**
 * Created by ga on 27/12/14.
 */
var os = require('os');
module.exports = {
    // application metadata database configuration
    db: {
        type: 'levelup',
        url: os.tmpdir() + '/nQuery.test.db'
    }
}