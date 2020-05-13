var express = require('express');
var router = express.Router();
var axios = require('axios').default;
const asyncMiddleware = require('../middlewares/async');
const ZaloController = require('../controllers/ZaloController');

router.post('/', asyncMiddleware(ZaloController.replyMessage));

module.exports = router;
