const zaloService = require('../services/zalo');
const botService = require('../services/bot');
var { CLIENT_ENDPOINT } = require('../constants');

const replyMessage = async (req, res) => {
    console.log('=================Request From Zalo ===================');
    console.log(req.body);
    console.log('=================End Request Of Zalo==================');
    let { recipient, sender, event_name, message } = req.body;
    const messageReply = await zaloService.replyMessage({
        oaId: recipient.id,
        senderId: sender.id,
        eventName: event_name,
        message: message.text,
        msgId: message.msg_id,
    });
    return res.send({ status: 200, message: 'Send' });
};

const connectOfficalAccount = async (req, res) => {
    const { access_token, oaId } = req.query;
    const newOa = await zaloService.getDataOfOa({ access_token, oaId });
    const newBot = await botService.addNewBot(newOa);
    res.redirect(`${CLIENT_ENDPOINT}/home/${newBot._id}`);
};
module.exports = {
    connectOfficalAccount,
    replyMessage,
};