var express = require('express');
var router = express.Router();
let Bot = require('../models/bots');

/* GET home page. */
router.get('/', function (req, res, next) {
    Bot.find({ deleteFlag: false }, function (err, bots) {
        if (err) {
            res.status(400)
        }
    });
});

module.exports = router;
