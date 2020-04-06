var express = require('express');
var router = express.Router();
const verifyWebhook = require('../verify-webhook');
/* GET users listing. */
router.get('/', verifyWebhook);

module.exports = router;
