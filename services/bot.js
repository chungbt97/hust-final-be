/**
 * Author: ChungBT
 * Logic with bot
 */

const CustomError = require('../common/CustomError');
const errorCodes = require('../constants/errors');
const BotModel = require('../models/Bot');
const AccountModel = require('../models/Account');
const queryUtils = require('../utils/query');
const tableName = require('../constants/table');

const getAllBot = async (id) => {
    const bots = await BotModel.find(
        { user_id: id, deleteFlag: false },
        function (err) {
            if (err) throw new CustomError(errorCodes.INTERNAL_SERVER_ERROR);
        }
    );
    if (!bots) throw new CustomError(errorCodes.NOT_FOUND);
    return bots;
};

const addNewBot = async (data) => {
    const { userId, bot } = data;
    const { title, description, keyApp, tokenApp } = bot;
    const account = await AccountModel.findById(userId);
    if (!account) new CustomError(errorCodes.BAD_REQUEST);
    let newBot = await BotModel.create({
        name: title,
        description,
        keyApp,
        tokenApp,
        user_id: userId,
    });
    return newBot;
};

const updateBot = async (data) => {
    const { userId, bot } = data;
    const { id, title, description, keyApp, tokenApp } = bot;
    const account = await AccountModel.findById(userId);
    if (!account) new CustomError(errorCodes.BAD_REQUEST);
    const fieldUpdates = queryUtils.getFieldUpdates(tableName.BOT, {
        userId,
        bot,
    });
    console.log(fieldUpdates);
    let botEdit = await BotModel.findOneAndUpdate(
        { _id: id },
        {
            $set: fieldUpdates,
        },
        {
            new: true,
        }
    );
    return botEdit;
};

const deleteBot = async (data) => {
    const { userId, botId } = data;
    const account = await AccountModel.findById(userId);
    if (!account) new CustomError(errorCodes.BAD_REQUEST);
    let botDelete = await BotModel.findByIdAndUpdate(
        botId,
        {
            $set: {
                updatedAt: new Date().now,
                deleteFlag: true,
            },
        },
        {
            new: true,
        }
    );
    return botDelete;
};
module.exports = { getAllBot, addNewBot, updateBot, deleteBot };
