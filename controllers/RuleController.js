const RuleService = require('../services/rule');

// lấy ra toàn bộ các Rule
const getRule = async (req, res) => {
    const { botId } = req.params;
    const rules = await RuleService.getAllRulesOfBot({ botId });
    return res.send({
        status: 200,
        message: 'Created Done',
        data: rules,
    });
};

const addRule = async (req, res) => {
    const { botId } = req.params;
    const { keyword, blocks, texts } = req.body;
    const rule = await RuleService.addNewRuleForBot({
        botId,
        keyword,
        blocks,
        texts,
    });
    return res.send({
        status: 201,
        message: 'Created Done',
        data: rule,
    });
};

const updateRule = async (req, res) => {
    const { botId, ruleId } = req.params;
    const { keyword, blocks, texts } = req.body;
    const rule = await RuleService.updateRuleOfBot({
        botId,
        keyword,
        blocks,
        texts,
        ruleId,
    });
    return res.send({
        status: 200,
        message: 'Update Done',
        data: rule,
    });
};

const deleteRule = async (req, res) => {
    const { botId, ruleId } = req.params;
    const rule = await RuleService.deleteRule({
        botId,
        ruleId,
    });
    return res.send({
        status: 200,
        message: 'Delete Done',
        data: rule,
    });
};

module.exports = { getRule, addRule, updateRule, deleteRule };
