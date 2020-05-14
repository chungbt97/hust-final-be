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
var axios = require('axios');
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
    const { description, name, avatar, tokenApp, oaId } = data;
    let bot = await BotModel.findOne({ oa_id: oaId });
    if (bot) throw new CustomError(errorCodes.OA_EXISTS);
    let newBot = await BotModel.create({
        name,
        description,
        oa_id: oaId,
        tokenApp,
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

const updateUserForNewBot = async (data) => {
    const { newBotId, userId } = data;
    let botEdit = await BotModel.findOneAndUpdate(
        { _id: newBotId, deleteFlag: false, user_id: { $exists: false } },
        {
            $set: { user_id: userId },
        },
        {
            new: true,
        },
    );

    if (!botEdit) throw new CustomError(errorCodes.BAD_REQUEST);
    return botEdit;
};

module.exports = {
    getAllBot,
    addNewBot,
    updateBot,
    deleteBot,
    updateUserForNewBot,
};
