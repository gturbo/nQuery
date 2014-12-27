var levelUp = require('levelup');
function getUserHome() {
    return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
};

// open a data store
var db = levelUp(getUserHome()+'/.nQuery.db');
db.sep = '\x00';
db.end = '\x00\xFF';
var _nextId = Date.now();
db.getId = function () {
    return _nextId++;
};
exports = db;