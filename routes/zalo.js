var express = require('express');
var router = express.Router();
var axios = require('axios').default;
const asyncMiddleware = require('../middlewares/async');
const ZaloController = require('../controllers/ZaloController');
/* GET home page. */
router.get('/', async function (req, res, next) {
    const { msg } = req.body;
    let options = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        data: {
            event_name: 'user_send_text',
            app_id: '3519025660125585701',
            sender: { id: '6002036101744210448' },
            recipient: { id: '2308864567279896758' },
            message: { text: msg, msg_id: '0dc5bf4a67cf23907adf' },
            timestamp: '1587611428824',
            user_id_by_app: '8714871116905912652',
        },
        url: 'http://localhost:8080/webhook',
    };
    await axios(options);
    res.sendStatus(200);
});

router.post('/', asyncMiddleware(ZaloController.replyMessage));

module.exports = router;
