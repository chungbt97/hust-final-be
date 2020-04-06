var express = require('express');
var router = express.Router();

var ZaloOA = require('zalo-sdk').ZaloOA;
var zaloConfig = {
    oaid: '3519025660125585701',
    secretKey: 'XNiPWcK34Y8x48Eg6BxR',
};

var ZOAClient = new ZaloOA(zaloConfig);

/* GET home page. */
router.post('/', function (req, res, next) {
    console.log(req.query);
    if (req.body.event === 'sendmsg') {
        let { message } = req.body;
        replyMessage(req.query.fromid);
    }
    res.sendStatus(200);
});

function replyMessage(uid) {
    var userid = uid;
    ZOAClient.api(
        'sendmessage/text',
        'POST',
        { uid: userId, message: '안녕하세요 [an-nhong-ha-sê-yô]' },
        function (response) {
            console.log(response);
        }
    );
}

module.exports = router;
