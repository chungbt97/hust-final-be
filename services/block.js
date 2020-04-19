const CustomError = require('../common/CustomError');
const errorCodes = require('../constants/errors');
const GroupModel = require('../models/group');
const BlockModel = require('../models/block');

const getBlock = async (data) => {
    let { botId, groupId, blockId } = data;
    let group = await GroupModel.findOne({ _id: groupId, bot_id: botId });
    if (!group) throw new CustomError(errorsCodes.BAD_REQUEST);
    let block = await (await BlockModel.findOne({ _id: blockId }))
        .populated('elements')
        .exec();
    if (!block) throw new CustomError(errorsCodes.BAD_REQUEST);
    return block;
};

const addBlock = async (data) => {
    let { botId, groupId, name } = data;
    let group = await GroupModel.findOne({ _id: groupId, bot_id: botId });
    if (!group) throw new CustomError(errorsCodes.BAD_REQUEST);
    const session = await GroupModel.startSession();
    session.startTransaction();
    try {
        const opts = { session };
        const newBlock = await BlockModel.create(
            [
                {
                    name,
                    group_id: groupId,
                },
            ],
            opts
        );
        if (!newBlock) throw new CustomError(errorCodes.INTERNAL_SERVER_ERROR);
        const groupUpdate = await GroupModel.findByIdAndUpdate(
            { _id: groupId },
            { $push: { blocks: newBlock[0]._id } },
            opts
        );
        if (!groupUpdate)
            throw new CustomError(errorCodes.INTERNAL_SERVER_ERROR);
        await session.commitTransaction();
        session.endSession();
        return { newBlock, groupUpdate };
    } catch (error) {
        console.log(error);
        await session.abortTransaction();
        session.endSession();
        throw new CustomError(errorCodes.INTERNAL_SERVER_ERROR);
    }
};

const updateNameBlock = async (data) => {
    let { botId, groupId, blockId, name } = data;
    let group = await GroupModel.findOne({ _id: groupId, bot_id: botId });
    if (!group) throw new CustomError(errorsCodes.BAD_REQUEST);
    let block = await BlockModel.findByIdAndUpdate(
        { _id: blockId },
        { name: name }
    );
    if (!block) throw new CustomError(errorCodes.BAD_REQUEST);
    return block;
};

const deleteBlock = async (data) => {
    let { botId, groupId, blockId } = data;
    let group = await GroupModel.findOne({ _id: groupId, bot_id: botId });
    if (!group) throw new CustomError(errorsCodes.BAD_REQUEST);
    let block;
    if (blockId !== undefined && blockId !== null) {
        block = await BlockModel.findByIdAndUpdate(
            { _id: blockId },
            { deleteFlag: true }
        );
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
        GroupModel.findOne({ _id: fromGroupId, bot_id: botId }),
        GroupModel.findOne({ _id: toGroupId, bot_id: botId }),
    ]);
    if (!startGroup || !desGroup)
        throw new CustomError(errorsCodes.BAD_REQUEST);

    // transaction
    const session = await GroupModel.startSession();
    session.startTransaction();
    try {
        // clone session
        const opts = { session };
        const fromGroup = await GroupModel.findByIdAndUpdate(
            { _id: fromGroupId },
            { $pull: { blocks: blockId } },
            opts
        );
        const toGroup = await GroupModel.findByIdAndUpdate(
            { _id: toGroupId },
            { $push: { blocks: blockId } },
            opts
        );
        const block = await BlockModel.findByIdAndUpdate(
            { _id: blockId },
            { $set: { group_id: toGroupId } },
            opts
        );
        await session.commitTransaction();
        session.endSession();
        return { fromGroup, toGroup, blockId };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw new CustomError(errorCodes.INTERNAL_SERVER_ERROR);
    }
};

module.exports = {
    getBlock,
    addBlock,
    updateNameBlock,
    deleteBlock,
    transferBlock,
};
