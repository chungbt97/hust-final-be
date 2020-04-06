var express = require('express');
var router = express.Router();
let Bot = require('../models/bots');

/* GET home page. */
router.get('/', function (req, res, next) {
   res.send('Home page');
});

module.exports = router;
