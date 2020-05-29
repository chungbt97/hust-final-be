var express = require('express');
var router = express.Router();
var axios = require('axios').default;
const asyncMiddleware = require('../middlewares/async');
const ZaloController = require('../controllers/ZaloController');

router.get('/test', async function (req, res, next) {
    let options = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        data: {
            recipient: { user_id: '6002036101744210448' },
            message: {
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'list',
                        elements: [
                            {
                                title: 'Tiêu đề',
                                subtitle:
                                    'Nhập các trường và xem preview ở màn hình chính',
                                image_url:
                                    'https://api-chungbt.vbee.vn/bots/image/82db28ed4de88ce1c2f1bee310d39ad1-den_2.jpg',
                            },
                            {
                                title: 'Website',
                                image_url:
                                    'https://api-chungbt.vbee.vn/bots/image/82db28ed4de88ce1c2f1bee310d39ad1-den_2.jpg',
                                default_action: {
                                    type: 'oa.open.url',
                                    url:
                                        'https://www.youtube.com/watch?v=30kJq0qy330',
                                },
                            },
                            {
                                title: 'SMS',
                                image_url:
                                    'https://api-chungbt.vbee.vn/bots/image/82db28ed4de88ce1c2f1bee310d39ad1-den_2.jpg',
                                default_action: {
                                    type: 'oa.open.sms',
                                    payload: {
                                        content: 'alo',
                                        phone_code: '0971702707',
                                    },
                                },
                            },
                            {
                                title: 'Phone',
                                image_url:
                                    'https://api-chungbt.vbee.vn/bots/image/82db28ed4de88ce1c2f1bee310d39ad1-den_2.jpg',
                                default_action: {
                                    type: 'oa.open.phone',
                                    payload: { phone_code: '0971702707' },
                                },
                            },
                        ],
                    },
                },
                text: '',
            },
        },
        url:
            'https://openapi.zalo.me/v2.0/oa/message?access_token=VT0_FbKiwHrvtpayKIZg673OEpbOCvPb8e8R9t8hn0Gyccr_4cdoBNtEB0m9QhWmU9iaGoONb3qCl1D7SK--93o-764M5Q8STe5sEmqkyaP5YdXbQ2BEEJI_HcrlJkKJ3CytP5TlfXuPvWazLqAPMtYg7Jm7ER99Aeiz2d83l7yIimycU2MCVZBJ7Y938f9ITxGT4Iaxap9HnmTl4cMII5dKDZOpLv8ANlatJYfUa3HMzWPF7tk2FLRp45qAJeOzUC9JP5PVZ1q7z2r4RdUHEb0u6SNc4LSxwXe',
    };
    let response = await axios(options);
    res.send(response.data);
});

router.get('/', asyncMiddleware(ZaloController.connectOfficalAccount));

router.post('/', asyncMiddleware(ZaloController.replyMessage));

module.exports = router;
