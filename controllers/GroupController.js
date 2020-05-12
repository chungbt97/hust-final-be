const groupService = require('../services/group');

// lấy ra toàn bộ các group có chứa cả block
const getGroup = async (req, res) => {
    let { botId } = req.params;
    let { key } = req.query;
    let groups = await groupService.getGroupOfBot({ botId, keySearch: key });
    res.send({
        status: 200,
        message: 'Ok',
        data: groups,
    });
};
// thêm 1 cái group trống ko có gì
const addGroup = async (req, res) => {
    let { name } = req.body;
    let { botId } = req.params;
    let group = await groupService.addNewGroupToBot({
        botId,
        name,
    });
    return res.send({
        status: 201,
        message: 'Created Done',
        data: group,
    });
};

const updateGroup = async (req, res) => {
    let { botId, groupId } = req.params;
    let { name } = req.body;
    let group = await groupService.updateGroup({
        name,
        groupId,
        botId,
    });
    return res.send({
        status: 200,
        message: 'Update Done',
        data: group,
    });
};

const deleteGroup = async (req, res) => {
    let { groupId, botId } = req.params;
    let group = await groupService.deleteGroup({ groupId, botId });
    return res.send({
        status: 200,
        message: 'Delete Done',
        data: group,
    });
};

module.exports = { getGroup, addGroup, updateGroup, deleteGroup };
