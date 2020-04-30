const RuleModel = require('../models/rule');
const errorCodes = require('../constants/errors');
const CustomError = require('../common/CustomError');
const BotModel = require('../models/bot');

const getAllRulesOfBot = async (data) => {
    const { botId } = data;
    const bot = await BotModel.findOne({ _id: botId, deleteFlag: false });
    if (!bot) throw new CustomError(errorCodes.BAD_REQUEST);
    const rules = await RuleModel.find({ bot_id: botId, deleteFlag: false })
        .populate({
            path: 'blocks',
            match: { deleteFlag: false },
            select: '_id name',
        })
        .exec();
    return rules;
};

const addNewRuleForBot = async (data) => {
    const { botId, keyword, blocks, texts } = data;
    const bot = await BotModel.findOne({ _id: botId, deleteFlag: false });
    if (!bot) throw new CustomError(errorCodes.BAD_REQUEST);
    let rule = await RuleModel.create({
        keyword,
        blocks,
        texts,
        bot_id: botId,
    });
    return rule;
};

const updateRuleOfBot = async (data) => {
    const { botId, keyword, blocks, texts, ruleId } = data;
    const bot = await BotModel.findOne({ _id: botId, deleteFlag: false });
    if (!bot) throw new CustomError(errorCodes.BAD_REQUEST);
    let rule = await RuleModel.findOneAndUpdate(
        { _id: ruleId, deleteFlag: false },
        {
            keyword,
            blocks,
            texts,
        },
        { new: true },
    );
    return rule;
};

const deleteRule = async (data) => {
    const { botId, ruleId } = data;
    const bot = await BotModel.findOne({ _id: botId, deleteFlag: false });
    if (!bot) throw new CustomError(errorCodes.BAD_REQUEST);
    let rule = await RuleModel.findOneAndUpdate(
        { _id: ruleId, deleteFlag: false },
        {
            deleteFlag: true,
        },
        { new: true },
    );
    return rule;
};

module.exports = {
    getAllRulesOfBot,
    addNewRuleForBot,
    updateRuleOfBot,
    deleteRule,
};
