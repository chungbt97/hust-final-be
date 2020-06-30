/**
 * Author: ChungBT
 * Logic with bot
 */

const CustomError = require('../common/CustomError');
const errorCodes = require('../constants/errors');
const BotModel = require('../models/bot');
const UserModel = require('../models/user');
const RuleModel = require('../models/rule');
const AccountModel = require('../models/account');
const GroupModel = require('../models/group');
const GroupService = require('../services/group');
const UserService = require('../services/user');
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
    const { description, name, avatar, tokenApp, oaId, cover } = data;
    let bot = await BotModel.findOneAndUpdate(
        { oa_id: oaId, deleteFlag: false },
        {
            name,
            description,
            tokenApp,
            avatar,
            cover,
        },
    );
    if (!bot) {
        let newBot = await BotModel.create({
            name,
            description,
            oa_id: oaId,
            tokenApp,
            avatar,
            cover,
        });
        if (newBot) {
            await GroupModel.create({
                name: 'Default Group',
                defaultGroup: true,
                bot_id: newBot._id,
            });
        }
        return newBot;
    }
    return bot;
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
    let botDelete = await BotModel.findByIdAndDelete(botId);
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
    return botEdit;
};

const getDataOfBot = async (data) => {
    const { botId } = data;
    let bot = await BotModel.findOne({ _id: botId, deleteFlag: false });
    if (!bot) throw new CustomError(errorCodes.BAD_REQUEST);
    let [totalFollowers, totalRules, blocks, totalSession] = await Promise.all([
        UserModel.find({ bot_id: botId }).count(),
        RuleModel.find({ bot_id: botId, deleteFlag: false }).count(),
        GroupService.getAllBlocks(botId),
        UserService.countTotalSesions(botId),
    ]);
    return {
        bot,
        totalFollowers,
        totalRules,
        totalBlocks: blocks.length,
        totalSession,
    };
};

module.exports = {
    getAllBot,
    addNewBot,
    updateBot,
    deleteBot,
    updateUserForNewBot,
    getDataOfBot,
};
