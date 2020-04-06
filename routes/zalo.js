var express = require('express');
var router = express.Router();
var axios = require('axios').default;

/* GET home page. */
router.get('/', function (req, res, next) {
    console.log(req.query);
    if (req.body.event === 'sendmsg') {
        let { message } = req.body;
        replyMessage(req.query.fromid);
    }
    res.sendStatus(200);
});

router.post('/', function (req, res, next) {
    console.log(req.query);
    res.sendStatus(200);
});

async function replyMessage(uid) {
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
            'https://openapi.zalo.me/v2.0/oa/message?access_token=2JItFgheloqDEx4yhkoyA0Gyipcdz-TLPrQp897flpDdNjL3cOcLBJ8abLcGfiKJG16HKP6-opbeOgnAZSRQ6tDBf6gi-kW92aM4RVdXqpGqI8WcujV7Dof0g4R0pDGK21cvOUsMvHDFEkzZf-sm5tHkuts3tBzjVbZs9g7JWrzoSuyRqlFJIWSdlItcizey81o6LjwhyaCTEuyblRgFKK4SZXMYoFbENMci3RtUzq9PIBOvcUBDK2PLiZdr_S1CDqsr9FMTpb8UA8SQpuJsV9BbE26e_xmg',
    };
    await axios(options)
        .then(function (response) {
            // handle success
            console.log(response);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
}

router.get('/token', function (req, res, next) {
    console.log(req.query);
    console.log(req.body.json());
    res.sendStatus(200);
});

module.exports = router;
