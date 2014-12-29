var express = require('express');
var db = require('../database');
var router = express.Router();

// get all elements from type
router.get('/:type', function(req,res) {
    var type = req.param('type');
    var start = true;
    db.createReadStream({
        start     : type
        , end       : type+db.end
        , keys      : false
        , values    : true
    }).on('data', function(data) {
        if (start) {
            res.write('[' + data);
            start = false;
        } else {
            res.write(',' + data);
        }
    }).on('end', function() {
        res.end(start ? '[]' : ']');
    }).on('error', function(err) {
        console.log('error when retrieving collection ' + type + ' ' + err);
    })
    ;
});

// get element by type and id
router.get('/:type/:id', function (req, res) {
    var type = req.param('type'), id = req.param('id');
    if (!(type && id))
        res.status(400).send('unable to retrieve object for type:' + type + ' and id: ' + id);
    else {
        db.get(db.getKey(type, id), function (err, obj) {
            if (err)
                res.status(404).send('unable to retrieve object for type:' + type + ' and id: ' + id + ' error: ' + err);
            else {
                console.log('retrieved ' + obj);
                res.end(obj);
            }
        });
    }
});

// update existing element (an id must be provided inside PUT body object)
router.put('/:type', function (req, res) {
    var type = req.param('type'), body = req.body;
    if (!(type && body === Object(body))) {
        res.status(400).send('unable to store object for unknown type:' + type + ' or invalid content: ', body);
        return;
    }
    var id = body.id;
    if (!id) {
        res.status(400).send('unable to store ' + type + ' object for wrong id:' + id);
        return;
    }
    db.put(db.getKey(type, id), JSON.stringify(body),function (err) {
        if (err)
            res.status(500).send('unable to save object for type:' + type + ' and id: ' + id);
        else
            res.send();
    });
});

// post a new element or updates if an id is provided
router.post('/:type', function (req, res) {
    var type = req.param('type'), body = req.body;
    if (!(type && body === Object(body))) {
        res.status(400).send('unable to store object for unknown type:' + type + ' or invalid content: ', body);
        return;
    }
    var id = body.id, hasId = id;
    if (!hasId) {
        id = db.getId();
        body.id=id;
    }
    db.put(db.getKey(type, id), JSON.stringify(body),function (err) {
        if (err)
            res.status(500).send('unable to save object for type:' + type + ' and id: ' + id);
        else
            res.send(hasId ? '' : '{"id":"' + id + '"}'); // return added property for backbone model
    });
});
// deletes an element
router.delete('/:type/:id', function (req, res) {
    var type = req.param('type'), id = req.param('id');
    if (!(type && id))
        res.status(404).send('unable to delete object for type:' + type + ' and id: ', id);
    else {
        db.del(db.getKey(type, id), function (err, obj) {
            if (err)
                res.status(404).send('unable to delete object for type:' + type + ' and id: ', id);
            else
                res.send();
        });
    }
});

module.exports = router;
