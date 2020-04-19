/**
 * Author: ChungBT
 * Controller handle action with bot
 */
const botService = require('../services/bot');

const getAllBot = async (req, res) => {
    let userId = req.data.accountId;
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

const updateBot = async (req, res) => {
    let userId = req.data.accountId;
    let data = req.body;
    let oldBot = await botService.updateBot({
        userId,
        bot: data,
    });
    return res.send({
        status: 200,
        message: 'Update bot done',
        data: oldBot,
    });
};

const deleteBot = async (req, res) => {
    let { botId } = req.body;
    let oldBot = await botService.deleteBot({
        userId,
        botId,
    });
    return res.send({
        status: 200,
        message: 'Delete bot done',
    });
};

module.exports = { getAllBot, addNewBot, updateBot, deleteBot };
