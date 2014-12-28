/**
 * Created by ga on 27/12/14.
 */

function getUserHome() {
    return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
};

module.exports = {
    getUserHome: getUserHome,
    // application metadata database configuration
    db: {
        type: 'levelup',
        url: getUserHome() + '/.nQuery.db'
    }
}