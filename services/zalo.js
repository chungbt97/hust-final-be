const axios = require('axios').default;
const userService = require('./user');
const errorCodes = require('../constants/errors');
const CustomError = require('../common/CustomError');
const BotModel = require('../models/bot');
const BlockModel = require('../models/block');
const UserModel = require('../models/user');
const AttributeModal = require('../models/attribute');
const messageService = require('./message');
const { ZALO_ENDPOINT } = require('../constants');

const replyMessage = async (data) => {
    const { oaId, senderId, eventName, message, msgId, info } = data;
    const bot = await BotModel.findOne({ oa_id: oaId, deleteFlag: false });
    if (!bot) throw new CustomError(errorCodes.BOT_NOT_EXISTS);
    const { user, newUser } = await userService.findOrCreateUser({
        userAppId: senderId,
        botId: bot._id,
        tokenApp: bot.tokenApp,
    });
    if (newUser) {
        const requestShareInfo = messageService.requestShareInfo({ user, bot });
    } else {
        const replyMessage = messageService.sendMessage({
            event_name: eventName,
            messageText: message,
            bot,
            user,
            msgId,
            info,
        });
    }
};

const getDataOfOa = async (data) => {
    const { access_token, oaId } = data;
    const oa = await callApiGetOa(access_token);
    const { description, name, avatar, cover } = oa;
    return { description, name, avatar, tokenApp: access_token, oaId, cover };
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

const sendMsgText = async (data) => {
    const { botId, recipientId, text } = data;
    let bot = await BotModel.findById(botId);
    if (!bot) throw new CustomError(errorCodes.BOT_NOT_EXISTS);
    let token = bot.tokenApp;
    let error = [];
    let reg = /{{(\w+)}}/gi;
    for (let i = 0; i < recipientId.length; i++) {
        const id = recipientId[i];
        let textMsg = await asyncFindAttributes(text, reg, id);
        await callApiSendText(id, textMsg, token).then((res) => {
            let { error, message } = res.data;
            if (error !== 0) {
                error.push(new CustomError(error));
            }
        });
    }
    if (error.length === 0)
        return { message: 'success', status: 'OK', code: '200' };
    else return { message: 'faild', error };
};

const asyncFindAttributes = async (text, reg, id) => {
    var listNameAttributes = [];
    text.match(reg).forEach((name) =>
        listNameAttributes.push(name.substring(2, name.length - 2)),
    );
    const attributes = await AttributeModal.find({
        user_app_id: id,
        name: { $in: listNameAttributes },
    });
    text = text.replace(reg, function (word) {
        word = word.substring(2, word.length - 2);
        let attr = attributes.filter((attribute) => {
            return attribute.name === word;
        })[0];
        if (attr) {
            return attr.value;
        } else {
            return '- ' + word + ' của bạn -';
        }
    });
    return text;
};

const callApiSendText = async (recipientId, msgText, token) => {
    let option = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        data: {
            recipient: {
                user_id: recipientId,
            },
            message: {
                text: msgText,
            },
        },
        url: `${ZALO_ENDPOINT}/message?access_token=${token}`,
    };
    return await axios(option);
};

const sendBlock = async (data) => {
    let { blockId, recipientId, botId } = data;
    let bot = await BotModel.findById(botId);
    if (!bot) throw new CustomError(errorCodes.BOT_NOT_EXISTS);
    let token = bot.tokenApp;
    let block = await BlockModel.findById(blockId).populate('elements').exec();
    let { arrReturn, idReturn } = messageService.getElement(block);

    for (let i = 0; i < recipientId.length; i++) {
        let userAppId = recipientId[i];
        let newSession = userService.generatorSession(userAppId);
        let user = await UserModel.findOne({ user_app_id: userAppId });
        await UserModel.findOneAndUpdate(
            { user_app_id: userAppId },
            {
                $push: { old_session: user.current_session },
                $set: { element_id: idReturn, current_session: newSession },
            },
        );

        for (let j = 0; j < arrReturn.length; j++) {
            let option = messageService.fillDataToOption(
                arrReturn[j],
                token,
                userAppId,
            );
            await axios(option).then((res) => {
                console.log(res.data);
            });
        }
    }
};
module.exports = { replyMessage, getDataOfOa, sendMsgText, sendBlock };
