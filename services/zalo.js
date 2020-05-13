var axios = require('axios').default;
const userService = require('./user');
const errorCodes = require('../constants/errors');
const CustomError = require('../common/CustomError');
const BotModel = require('../models/bot');
const messageService = require('./message');

const replyMessage = async (data) => {
    const { oaId, senderId, eventName, message, msgId } = data;
    const bot = await BotModel.findOne({ oa_id: oaId, deleteFlag: false });
    console.log('==================11==================');
    console.log(bot)
    console.log('====================================');
    if (!bot) throw new CustomError(errorCodes.BOT_NOT_EXISTS);
    const user = await userService.findOrCreateUser({
        userAppId: senderId,
        botId: bot._id,
        tokenApp: bot.tokenApp,
    });
    console.log('===================20=================');
    console.log(user);
    console.log('====================================');
    const replyMessage = messageService.sendMessage({
        event_name: eventName,
        messageText: message,
        bot,
        user,
        msgId
    });
};
module.exports = { replyMessage };
