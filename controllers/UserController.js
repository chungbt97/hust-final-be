const userService = require('../services/user');
const groupService = require('../services/group');
const zaloService = require('../services/zalo');
var { CLIENT_ENDPOINT } = require('../constants');

const getAllUsers = async (req, res) => {
    let { botId } = req.params;
    let { attr, value, query } = req.query;

    let [listBlock, listUser, listData, listAttr] = await Promise.all([
        groupService.getAllBlocks(botId),
        userService.getAllDataUser({ botId, attr, value, query }),
        userService.getAllData(botId),
        userService.getDistinNameAttribute(botId),
    ]);

    return res.send({
        status: 200,
        message: 'Send',
        data: { listBlock, listUser, listData, listAttr },
    });
};

const sendMessageToUser = async (req, res) => {
    let { botId } = req.params;
    const { blockId, recipientId, sendText, text } = req.body;
    if (sendText) {
        zaloService.sendMsgText({ botId, recipientId, text });
    } else {
        zaloService.sendBlock({ botId, recipientId, blockId });
    }
    return res.send({
        status: 200,
        message: 'Send',
    });
};

module.exports = {
    getAllUsers,
    sendMessageToUser,
};
