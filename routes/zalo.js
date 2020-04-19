var express = require('express');
var router = express.Router();
var axios = require('axios').default;
var blockController = require('../controllers/BlockController');
const auth = require('../middlewares/auth');
const asyncMiddleware = require('../middlewares/async');
/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.query.event === 'sendmsg') {
        let { message } = req.query.message;
        replyMessage(req.query.fromuid);
    }
    res.sendStatus(200);
});

router.post('/', function (req, res, next) {
    console.log(req.query);
    res.sendStatus(200);
});

function replyMessage(uid) {
    console.log(uid);
    const options = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        data: {
            recipient: {
                user_id: uid,
            },
            message: {
                text: '안녕하세요 [an-nhong-ha-sê-yô]',
            },
        },
        url:
            'https://openapi.zalo.me/v2.0/oa/message?access_token=hQXVTZR9a56ffrbqCisJLA2WMt4xrl4ftj5MS1tGxmJyta9TCl7lETpsMcKnnkiAoyn1RXVByXJ7vMLbFOdJG_MrRsCtrAGunRGHOGsXeX_Md6n4AB3O8zAdI4SlqkLc_zvAFo79_KJVf3eB9QhyUUMyJoiOfuGF-Qe3U0USk5YKhd8WIxx-MggCQn1YjVyo_8DZJ3wjps6db7O0IBZxGRMlKm0diFbj-OPyJpoHy0BylLP6CQhc1ws8NIL5kynSdRCA7d6RX7gfX4irRMAgMFyLDDwJLW',
    };
    axios(options)
        .then(function (response) {
            // handle success
            console.log(response);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
}

module.exports = router;
