const zaloService = require('../services/zalo');


const replyMessage = async (req, res) => {
    let { recipient, sender, event_name, message } = req.body;
    const messageReply = await zaloService.replyMessage({
        oaId: recipient.id,
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
