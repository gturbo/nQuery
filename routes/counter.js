var express = require('express');
var router = module.exports = express.Router();
var counter = 0;

router.get('/', function(req,res) {
    res.status(200).send(counter++);
});

