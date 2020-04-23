const CustomError = require('../common/CustomError');
const errorCodes = require('../constants/errors');
const GroupModel = require('../models/group');
const BlockModel = require('../models/block');

const getBlock = async (data) => {
    let { botId, groupId, blockId } = data;
    let group = await GroupModel.findOne({
        _id: groupId,
        bot_id: botId,
        deleteFlag: false,
    });
    if (!group) throw new CustomError(errorsCodes.BAD_REQUEST);
    let block = await BlockModel.findOne({
        _id: blockId,
        group_id: groupId,
        deleteFlag: false,
    }).populate({
        path: 'elements',
        match: { deleteFlag: false },
        select: '_id name',
    });

    if (!block) throw new CustomError(errorsCodes.BAD_REQUEST);
    return block;
};

const addBlock = async (data) => {
    let { botId, groupId, name } = data;
    let group = await GroupModel.findOne({
        _id: groupId,
        bot_id: botId,
        deleteFlag: false,
    });
    if (!group) throw new CustomError(errorsCodes.BAD_REQUEST);

    const newBlock = await BlockModel.create({
        name,
        group_id: groupId,
    });
    if (!newBlock) throw new CustomError(errorCodes.INTERNAL_SERVER_ERROR);
    const groupUpdate = await GroupModel.findByIdAndUpdate(
        { _id: groupId, deleteFlag: false },
        { $push: { blocks: newBlock._id } }
    );
    if (!groupUpdate) throw new CustomError(errorCodes.INTERNAL_SERVER_ERROR);
    return { newBlock, groupUpdate };
};

const updateNameBlock = async (data) => {
    let { botId, groupId, blockId, name } = data;
    let group = await GroupModel.findOne({
        _id: groupId,
        bot_id: botId,
        deleteFlag: false,
    });
    if (!group) throw new CustomError(errorsCodes.BAD_REQUEST);
    let block = await BlockModel.findByIdAndUpdate(
        { _id: blockId, deleteFlag: false },
        { name: name }
    );
    if (!block) throw new CustomError(errorCodes.BAD_REQUEST);
    return block;
};

const deleteBlock = async (data) => {
    let { botId, groupId, blockId } = data;
    let group = await GroupModel.findOne({
        _id: groupId,
        bot_id: botId,
        deleteFlag: false,
    });
    if (!group) throw new CustomError(errorsCodes.BAD_REQUEST);
    let block;
    if (blockId !== undefined && blockId !== null) {
        block = await BlockModel.findByIdAndUpdate(blockId, {
            deleteFlag: true,
        });
        if (!block) throw new CustomError(errorCodes.INTERNAL_SERVER_ERROR);
    } else {
        block = await BlockModel.updateMany(
            { group_id: groupId },
            { deleteFlag: true }
        );
        if (!block) throw new CustomError(errorCodes.INTERNAL_SERVER_ERROR);
    }
    return block;
};

const transferBlock = async (data) => {
    let { botId, fromGroupId, toGroupId, blockId } = data;
    const [startGroup, desGroup] = await Promise.all([
        GroupModel.findOne({
            _id: fromGroupId,
            bot_id: botId,
            deleteFlag: false,
        }),
        GroupModel.findOne({
            _id: toGroupId,
            bot_id: botId,
            deleteFlag: false,
        }),
    ]);
    if (!startGroup || !desGroup) throw new CustomError(errorCodes.BAD_REQUEST);
    const fromGroup = await GroupModel.findByIdAndUpdate(
        { _id: fromGroupId, deleteFlag: false },
        { $pull: { blocks: blockId } }
    );
    if (!fromGroup) throw new CustomError(errorCodes.BAD_REQUEST);
    const toGroup = await GroupModel.findByIdAndUpdate(
        { _id: toGroupId, deleteFlag: false },
        { $push: { blocks: blockId } }
    );
    if (!toGroup) throw new CustomError(errorCodes.BAD_REQUEST);
    const block = await BlockModel.findByIdAndUpdate(
        { _id: blockId, deleteFlag: false },
        { $set: { group_id: toGroupId } }
    );
    if (!block) throw new CustomError(errorCodes.BAD_REQUEST);
    return { fromGroup, toGroup, blockId };
};

module.exports = {
    getBlock,
    addBlock,
    updateNameBlock,
    deleteBlock,
    transferBlock,
};
