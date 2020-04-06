var express = require('express');
var router = express.Router();
var axios = require('axios').default;

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.query.event === 'sendmsg') {
        let { message } = req.body;
        replyMessage(req.query.fromuid);
    }
    res.sendStatus(200);
});

router.post('/', function (req, res, next) {
    console.log(req.query);
    res.sendStatus(200);
});

function replyMessage(uid) {
    console.log(uid)
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
            'https://openapi.zalo.me/v2.0/oa/message?access_token=JXa9TH455GjA5Wzt5G4M3aCH3N8S6X94CL9dHYiI1MapKLeG3mS_4m1qGpql12Gr9rjXC3yrTImtOpm2QmDH87HX9I1OT4q-1XSk7HXhL0GV30WIG6Hc2dOL9JTyG3aOMLTaDayr0IvGT1XLU042RtnBGcvx0YbpHMfWNLmz2Nz7TNnPVcDaRNCf41ShT7qQTISzE514K39NLICDIKT9T58wI75nPr5kL1DCJGqR9L023MXMFta7Jc4tNMz1IZ8JMWnLAbjGA09dJKf-TMubB4mJ4XOC',
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
