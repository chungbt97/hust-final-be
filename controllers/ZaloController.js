const zaloService = require('../services/zalo');

const exampleBody = {
    event_name: 'user_send_text',
    app_id: '3519025660125585701',
    sender: { id: '6002036101744210448' },
    recipient: { id: '2308864567279896758' },
    message: { text: 'Annhong', msg_id: '0dc5bf4a67cf23907adf' },
    timestamp: '1587611428824',
    user_id_by_app: '8714871116905912652',
};

const replyMessage = async (req, res) => {
    let { app_id, sender, event_name, message } = req.body;
    const messageReply = await zaloService.replyMessage({
        appId: app_id,
        senderId: sender.id,
        eventName: event_name,
        message: message.text,
        msgId: message.msg_id
    });
    return res.send({ status: 200, message: 'Send' });
};

module.exports = {
    replyMessage,
};
