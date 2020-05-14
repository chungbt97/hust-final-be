var axios = require('axios').default;
const userService = require('./user');
const errorCodes = require('../constants/errors');
const CustomError = require('../common/CustomError');
const BotModel = require('../models/bot');
const messageService = require('./message');
const { ZALO_ENDPOINT } = require('../constants');

const replyMessage = async (data) => {
    const { oaId, senderId, eventName, message, msgId } = data;
    const bot = await BotModel.findOne({ oa_id: oaId, deleteFlag: false });
    if (!bot) throw new CustomError(errorCodes.BOT_NOT_EXISTS);
    const user = await userService.findOrCreateUser({
        userAppId: senderId,
        botId: bot._id,
        tokenApp: bot.tokenApp,
    });
    const replyMessage = messageService.sendMessage({
        event_name: eventName,
        messageText: message,
        bot,
        user,
        msgId,
    });
};

const getDataOfOa = async (data) => {
    const { access_token, oaId } = data;
    const oa = await callApiGetOa(access_token);
    const { description, name, avatar } = oa;
    return { description, name, avatar, tokenApp: access_token, oaId };
};

const callApiGetOa = async (token) => {
    let url = `${ZALO_ENDPOINT}/getoa?access_token=${token}`;
    const oa = await axios({
        headers: {
            'content-type': 'text/json;charset=utf-8',
        },
        method: 'get',
        url,
    });
    const { data } = oa;
    if (data.error !== 0) {
        throw new CustomError(errorCodes.ACCESS_TOKEN_INVALID);
    }
    return data.data;
};
module.exports = { replyMessage, getDataOfOa };
