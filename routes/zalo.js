var express = require('express');
var router = express.Router();
var axios = require('axios').default;
var blockController = require('../controllers/BlockController');
const auth = require('../middlewares/auth');
const asyncMiddleware = require('../middlewares/async');
/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendStatus(200);
});

router.post('/', function (req, res, next) {
    console.log('Post');
    let { event_name, sender, message } = req.body;
    let { id } = sender;
    let oldBot;
    if (event_name === 'user_send_text') {
        let { text } = message.text;
        let options = null;

        if (text === 'image')
            options = {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                data: {
                    recipient: {
                        user_id: id,
                    },
                    message: {
                        attachment: {
                            payload: {
                                elements: [
                                    {
                                        media_type: 'image',
                                        title: 'kaisa',
                                        url:
                                            'https://4.bp.blogspot.com/-NuSmmm8DNbQ/Xhim8bRWwtI/AAAAAAAATOc/-xusgk4771YEsrdB-6QAZvw-GqjK2mbKgCLcBGAsYHQ/w914-h514-p-k-no-nu/kaisa-lol-season-2020-uhdpaper.com-4K-5.1825-wp.thumbnail.jpg',
                                    },
                                ],
                                template_type: 'media',
                            },
                            type: 'template',
                        },
                        text: 'hello, world!',
                    },
                },
                url:
                    'https://openapi.zalo.me/v2.0/oa/message?access_token=hQXVTZR9a56ffrbqCisJLA2WMt4xrl4ftj5MS1tGxmJyta9TCl7lETpsMcKnnkiAoyn1RXVByXJ7vMLbFOdJG_MrRsCtrAGunRGHOGsXeX_Md6n4AB3O8zAdI4SlqkLc_zvAFo79_KJVf3eB9QhyUUMyJoiOfuGF-Qe3U0USk5YKhd8WIxx-MggCQn1YjVyo_8DZJ3wjps6db7O0IBZxGRMlKm0diFbj-OPyJpoHy0BylLP6CQhc1ws8NIL5kynSdRCA7d6RX7gfX4irRMAgMFyLDDwJLW',
            };
        else
            options = {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                data: {
                    recipient: {
                        user_id: id,
                    },
                    message: {
                        text: '안녕하세요 [an-nhong-ha-sê-yô]',
                    },
                },
                url:
                    'https://openapi.zalo.me/v2.0/oa/message?access_token=hQXVTZR9a56ffrbqCisJLA2WMt4xrl4ftj5MS1tGxmJyta9TCl7lETpsMcKnnkiAoyn1RXVByXJ7vMLbFOdJG_MrRsCtrAGunRGHOGsXeX_Md6n4AB3O8zAdI4SlqkLc_zvAFo79_KJVf3eB9QhyUUMyJoiOfuGF-Qe3U0USk5YKhd8WIxx-MggCQn1YjVyo_8DZJ3wjps6db7O0IBZxGRMlKm0diFbj-OPyJpoHy0BylLP6CQhc1ws8NIL5kynSdRCA7d6RX7gfX4irRMAgMFyLDDwJLW',
            };

        replyMessage(options);
        console.log(options);
    }
    res.sendStatus(200);
});

function replyMessage(options) {
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
