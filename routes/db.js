var express = require('express');
var db = require('../database');
var router = express.Router();

router.get('/:type/:id', function (req, res) {
    var type = req.param('type'), id = req.param('id');
    if (!(type && id))
        res.status(400).send('unable to retrieve object for type:' + type + ' and id: ' + id);
    else {
        db.get(type + db.sep + id, function (err, obj) {
            if (err)
                res.status(404).send('unable to retrieve object for type:' + type + ' and id: ' + id + ' error: ' + err);
            else {
                console.log('retrieved ' + obj);
                res.end(obj);
            }
        });
    }
});

router.post('/:type', function (req, res, next) {
    var type = req.param('type'), body = req.body;
    if (!(type && body === Object(body))) {
        res.status(400).send('unable to store object for unknown type:' + type + ' or invalid content: ', body);
        next();
    }
    var id = body.id;
    if (!id) {
        id = db.getId();
        res.set('LastInsertId', id);
        body.id=id;
    }
    db.put(type + db.sep + id, JSON.stringify(body),function (err) {
        console.log('after put');
        if (err)
            res.status(500).send('unable to save object for type:' + type + ' and id: ', id);
        else
            res.send();
    });
});

router.delete('/:type/:id', function (req, res) {
    var type = req.param('type'), id = req.param('id');
    if (!(type && id))
        res.status(404).send('unable to delete object for type:' + type + ' and id: ', id);
    else {
        db.del(type + db.sep + id, function (err, obj) {
            if (err)
                res.status(404).send('unable to delete object for type:' + type + ' and id: ', id);
            else
                res.send();
        });
    }
});

module.exports = router;
