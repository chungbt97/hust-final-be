/**
 * Author: ChungBT
 * Logic with bot
 */

const CustomError = require('../common/CustomError');
const errorCodes = require('../constants/errors');
const BotModel = require('../models/bot');
const AccountModel = require('../models/account');
const GroupModel = require('../models/group');
const queryUtils = require('../utils/query');
const tableName = require('../constants/table');
var axios = require('axios').default;
const { ZALO_ENDPOINT } = require('../constants');

const getAllBot = async (id) => {
    const account = await AccountModel.findOne({ _id: id });
    if (!account) throw new CustomError(errorCodes.BAD_REQUEST);
    const bots = await BotModel.find({ user_id: id, deleteFlag: false })
        .populate('user_id')
        .exec();
    if (!bots) throw new CustomError(errorCodes.NOT_FOUND);
    return bots;
};

const addNewBot = async (data) => {
    const { userId, bot } = data;
    const { name, description, tokenApp } = bot;
    const account = await AccountModel.findOne({
        _id: userId,
    });
    if (!account) throw new CustomError(errorCodes.BAD_REQUEST);
    let dataOa = await getInformationOa(tokenApp);
    const { oa_id, avatar } = dataOa;
    let newBot = await BotModel.create({
        name,
        description,
        oa_id,
        tokenApp,
        user_id: userId,
        avatar,
    });
    if (newBot) {
        await GroupModel.create({
            name: 'Default Group',
            defaultGroup: true,
            bot_id: newBot._id,
        });
    }
    return newBot;
};

const getInformationOa = async (token) => {
    let url = `${ZALO_ENDPOINT}/getoa?access_token=${token}`;
    const oa = await axios.get(url);
    const { data } = oa;
    if (data.error !== 0) {
        throw new CustomError(errorCodes.ACCESS_TOKEN_INVALID);
    }
    return data.data;
};

const updateBot = async (data) => {
    const { userId, bot, botId } = data;
    const { _id, name, description, oa_id, tokenApp } = bot;
    const account = await AccountModel.findOne({
        _id: userId,
    });
    if (!account) throw new CustomError(errorCodes.BAD_REQUEST);
    const fieldUpdates = queryUtils.getFieldUpdates(tableName.BOT, {
        userId,
        bot,
    });
    let botEdit = await BotModel.findOneAndUpdate(
        { _id: botId, deleteFlag: false },
        {
            $set: fieldUpdates,
        },
        {
            new: true,
        },
    );
    return botEdit;
};

const deleteBot = async (data) => {
    const { userId, botId } = data;
    const account = await AccountModel.findOne({
        _id: userId,
    });
    if (!account) throw new CustomError(errorCodes.BAD_REQUEST);
    let botDelete = await BotModel.findOneAndUpdate(
        { _id: botId, deleteFlag: false },
        {
            $set: {
                updatedAt: new Date().now,
                deleteFlag: true,
            },
        },
        {
            new: true,
        },
    );
    return botDelete;
};
module.exports = { getAllBot, addNewBot, updateBot, deleteBot };
