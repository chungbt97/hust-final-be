var express = require('express');
var router = express.Router();
var axios = require('axios').default;
var blockController = require('../controllers/BlockController');
const auth = require('../middlewares/auth');
const asyncMiddleware = require('../middlewares/async');
/* GET home page. */
router.get('/', async function (req, res, next) {
    let arr = [];
    let option1 = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        data: {
            recipient: {
                user_id: '6002036101744210448',
            },
            message: {
                text: 'Ảnh thứ nhất',
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'request_user_info',
                        elements: [
                            {
                                title: 'OA chatbot (Testing)',
                                subtitle: 'Tên của bạn là gì?',
                                image_url:
                                    'https://4.bp.blogspot.com/-NuSmmm8DNbQ/Xhim8bRWwtI/AAAAAAAATOc/-xusgk4771YEsrdB-6QAZvw-GqjK2mbKgCLcBGAsYHQ/w914-h514-p-k-no-nu/kaisa-lol-season-2020-uhdpaper.com-4K-5.1825-wp.thumbnail.jpg',
                            },
                        ],
                    },
                },
            },
        },
        url:
            'https://openapi.zalo.me/v2.0/oa/message?access_token=JXa9TH455GjA5Wzt5G4M3aCH3N8S6X94CL9dHYiI1MapKLeG3mS_4m1qGpql12Gr9rjXC3yrTImtOpm2QmDH87HX9I1OT4q-1XSk7HXhL0GV30WIG6Hc2dOL9JTyG3aOMLTaDayr0IvGT1XLU042RtnBGcvx0YbpHMfWNLmz2Nz7TNnPVcDaRNCf41ShT7qQTISzE514K39NLICDIKT9T58wI75nPr5kL1DCJGqR9L023MXMFta7Jc4tNMz1IZ8JMWnLAbjGA09dJKf-TMubB4mJ4XOC',
    };
    let option2 = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        data: {
            recipient: {
                user_id: '6002036101744210448',
            },
            message: {
                attachment: {
                    payload: {
                        elements: [
                            {
                                media_type: 'image',
                                title: 'kaisa',
                                url:
                                    'https://i.pinimg.com/originals/f2/e8/52/f2e852c6cec991ff1a11ba016898b1c5.jpg',
                            },
                        ],
                        template_type: 'media',
                    },
                    type: 'template',
                },
                text: 'Japan nature 2',
            },
        },
        url:
            'https://openapi.zalo.me/v2.0/oa/message?access_token=hQXVTZR9a56ffrbqCisJLA2WMt4xrl4ftj5MS1tGxmJyta9TCl7lETpsMcKnnkiAoyn1RXVByXJ7vMLbFOdJG_MrRsCtrAGunRGHOGsXeX_Md6n4AB3O8zAdI4SlqkLc_zvAFo79_KJVf3eB9QhyUUMyJoiOfuGF-Qe3U0USk5YKhd8WIxx-MggCQn1YjVyo_8DZJ3wjps6db7O0IBZxGRMlKm0diFbj-OPyJpoHy0BylLP6CQhc1ws8NIL5kynSdRCA7d6RX7gfX4irRMAgMFyLDDwJLW',
    };
    let option3 = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        data: {
            recipient: {
                user_id: '6002036101744210448',
            },
            message: {
                text: 'hallooooo',
            },
        },
        url:
            'https://openapi.zalo.me/v2.0/oa/message?access_token=hQXVTZR9a56ffrbqCisJLA2WMt4xrl4ftj5MS1tGxmJyta9TCl7lETpsMcKnnkiAoyn1RXVByXJ7vMLbFOdJG_MrRsCtrAGunRGHOGsXeX_Md6n4AB3O8zAdI4SlqkLc_zvAFo79_KJVf3eB9QhyUUMyJoiOfuGF-Qe3U0USk5YKhd8WIxx-MggCQn1YjVyo_8DZJ3wjps6db7O0IBZxGRMlKm0diFbj-OPyJpoHy0BylLP6CQhc1ws8NIL5kynSdRCA7d6RX7gfX4irRMAgMFyLDDwJLW',
    };
    arr.push(option1);
    arr.push(option2);
    arr.push(option3);
    let err = [];
    console.log(arr);
    for (let i = 0; i < arr.length; i++) {
        breakFor = false;
        await replyMessage(arr[i]).catch((error) => {
            err.push(new CustomError('Lỗi gì đó'));
            breakFor = true;
        });
        if (breakFor) break;
    }
    if (err.length > 0) {
        console.log(err[0]);
    }
    res.sendStatus(200);
});

router.post('/', function (req, res, next) {
    // TO DO
    // Sửa lại router có dạng : bots/:botId/webhook
    // Tạo ra file tạo ra các options cố định sắn!
    let { event_name, sender, message } = req.body;
    console.log(req.body);
    let { id } = sender;
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

const replyMessage = async (options) => {
    return await axios(options);
};

module.exports = router;
