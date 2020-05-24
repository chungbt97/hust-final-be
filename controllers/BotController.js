/**
 * Author: ChungBT
 * Controller handle action with bot
 */
const botService = require('../services/bot');
const userService = require('../services/user');
var mongoose = require('mongoose');

const getAllBot = async (req, res) => {
    let userId = req.data.accountId;
    let { newBotId } = req.query;
    if (newBotId !== -1 && mongoose.Types.ObjectId.isValid(newBotId)) {
        const updateNewBot = await botService.updateUserForNewBot({
            newBotId,
            userId,
        });
    }
    const bots = await botService.getAllBot(userId);
    return res.send({
        status: 200,
        message: 'Ok',
        data: bots,
    });
};

const addNewBot = async (req, res) => {
    let userId = req.data.accountId;
    let data = req.body;
    let newBot = await botService.addNewBot({
        userId,
        bot: data,
    });
    return res.send({
        status: 201,
        message: 'Created',
        data: newBot,
    });
};

const deleteBot = async (req, res) => {
    let userId = req.data.accountId;
    let { botId } = req.params;
    let oldBot = await botService.deleteBot({
        userId,
        botId,
    });
    return res.send({
        status: 200,
        message: 'Delete bot done',
    });
};

const getDataOfBot = async (req, res) => {
    const { botId } = req.params;
    let bot = await botService.getDataOfBot({
        botId,
    });
    return res.send({
        status: 200,
        message: 'Ok',
        data: bot,
    });
};

module.exports = { getAllBot, addNewBot, deleteBot, getDataOfBot };
