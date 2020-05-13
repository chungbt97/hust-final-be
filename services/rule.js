const RuleModel = require('../models/rule');
const errorCodes = require('../constants/errors');
const CustomError = require('../common/CustomError');
const BotModel = require('../models/bot');

const getAllRulesOfBot = async (data) => {
    const { botId, keySearch } = data;
    const bot = await BotModel.findOne({ _id: botId, deleteFlag: false });
    if (!bot) throw new CustomError(errorCodes.BAD_REQUEST);
    const rules = await RuleModel.find({ bot_id: botId, deleteFlag: false })
        .populate({
            path: 'blocks',
            match: { deleteFlag: false },
            select: '_id name',
        })
        .exec();
    if (keySearch === null || keySearch === 'undefined' || keySearch === '') {
        return rules;
    } else {
        let ruleFilter = [];
        rules.forEach((r) => {
            if (new RegExp(keySearch).test(r.keyword)) ruleFilter.push(r);
        });
        return ruleFilter;
    }
};

const addNewRuleForBot = async (data) => {
    const { botId, keyword, blocks } = data;
    const bot = await BotModel.findOne({ _id: botId, deleteFlag: false });
    if (!bot) throw new CustomError(errorCodes.BAD_REQUEST);
    let ruleModel = new RuleModel({
        keyword,
        blocks,
        bot_id: botId,
    });
    let rule = await ruleModel.save();
    await ruleModel.on('es-indexed', (err, result) => {
        console.log('indexed to elastic search');
        if (err) {
            console.log(err);
        }
    });
    rule = rule
        .populate({
            path: 'blocks',
            match: { deleteFlag: false },
            select: '_id name',
        })
        .execPopulate();
    return rule;
};

const updateRuleOfBot = async (data) => {
    const { botId, keyword, blocks, ruleId } = data;
    const bot = await BotModel.findOne({ _id: botId, deleteFlag: false });
    if (!bot) throw new CustomError(errorCodes.BAD_REQUEST);
    let rule = await RuleModel.findOneAndUpdate(
        { _id: ruleId, deleteFlag: false },
        {
            keyword,
            blocks,
        },
        { new: true },
    )
        .populate({
            path: 'blocks',
            match: { deleteFlag: false },
            select: '_id name',
        })
        .exec();
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
