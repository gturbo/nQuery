var express = require('express');
var db = require('../database');
var router = express.Router();

router.get('/:type/:id', function (req, res) {
    var type = req.param('type'), id = req.param('id');
    if (!(type && id))
        res.status(400).end('unable to retrieve object for type:' + type + ' and id: ', id);
    else {
        db.get(type + db.sep + id, function (err, obj) {
            if (err)
                res.status(404).end('unable to retrieve object for type:' + type + ' and id: ', id);
            else
                res.end(obj);
        });
    }
});

router.post('/:type', function (req, res) {
    var type = req.param('type'), body = req.body;
    if (!(type && body === Object(body))) {
        res.status(400).end('unable to store object for unknown type:' + type + ' or invalid content: ', body);
        return;
    }
    var id = body.id;
    if (!id) {
        id = db.getId();
        res.setHeader('LastInsertId', id);
    }
    db.put(type + db.sep + id, function (err) {
        if (err)
            res.status(500).end('unable to save object for type:' + type + ' and id: ', id);
        else
            res.end();
    });
});

router.delete('/:type/:id', function (req, res) {
    var type = req.param('type'), id = req.param('id');
    if (!(type && id))
        res.status(400).end('unable to delete object for type:' + type + ' and id: ', id);
    else {
        db.del(type + db.sep + id, function (err, obj) {
            if (err)
                res.status(404).end('unable to delete object for type:' + type + ' and id: ', id);
            else
                res.end();
        });
    }
});

module.exports = router;
