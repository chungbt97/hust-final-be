var express = require('express');
var router = express.Router();
var axios = require('axios').default;
const asyncMiddleware = require('../middlewares/async');
const ZaloController = require('../controllers/ZaloController');

router.get('/test', async function (req, res, next) {
    let data = {
        event_name: 'user_send_text',
        app_id: '3519025660125585701',
        sender: { id: '6002036101744210448' },
        recipient: { id: '2308864567279896758' },
        message: { text: 'Chào ad', msg_id: '915153e0137f4020196f' },
        timestamp: '1590758009845',
        user_id_by_app: '8714871116905912652',
    };
    axios.post('http://localhost:8080/webhook', data);
});

router.get('/', asyncMiddleware(ZaloController.connectOfficalAccount));

router.post('/', asyncMiddleware(ZaloController.replyMessage));

module.exports = router;
