const CustomError = require('../common/CustomError');
const errorCodes = require('../constants/errors');
const GroupModel = require('../models/group');
const BlockModel = require('../models/block');
const ElementModel = require('../models/element');
const fs = require('fs');
const path = require('path');

const getBlock = async (data) => {
    let { botId, groupId, blockId } = data;
    let group = await GroupModel.findOne({
        _id: groupId,
        bot_id: botId,
        deleteFlag: false,
    });
    if (!group) throw new CustomError(errorCodes.BAD_REQUEST);
    let block = await BlockModel.findOne({
        _id: blockId,
        group_id: groupId,
        deleteFlag: false,
    })
        .populate({
            path: 'elements',
            match: { deleteFlag: false },
        })
        .exec();

    if (!block) throw new CustomError(errorCodes.BAD_REQUEST);
    return block;
};

const addBlock = async (data) => {
    let { botId, groupId, name } = data;
    let group = await GroupModel.findOne({
        _id: groupId,
        bot_id: botId,
        deleteFlag: false,
    });
    if (!group) throw new CustomError(errorCodes.BAD_REQUEST);

    const newBlock = await BlockModel.create({
        name,
        group_id: groupId,
    });
    if (!newBlock) throw new CustomError(errorCodes.INTERNAL_SERVER_ERROR);
    const groupUpdate = await GroupModel.findByIdAndUpdate(
        { _id: groupId, deleteFlag: false },
        { $push: { blocks: newBlock._id } },
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
    if (!group) throw new CustomError(errorCodes.BAD_REQUEST);
    let block = await BlockModel.findByIdAndUpdate(
        { _id: blockId, deleteFlag: false },
        { name: name },
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
    if (!group) throw new CustomError(errorCodes.BAD_REQUEST);
    let block;
    if (blockId !== undefined && blockId !== null) {
        block = await BlockModel.findByIdAndUpdate(blockId, {
            deleteFlag: true,
        });
        if (!block) throw new CustomError(errorCodes.INTERNAL_SERVER_ERROR);
    } else {
        block = await BlockModel.updateMany(
            { group_id: groupId },
            { deleteFlag: true },
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
        { $pull: { blocks: blockId } },
    );
    if (!fromGroup) throw new CustomError(errorCodes.BAD_REQUEST);
    const toGroup = await GroupModel.findByIdAndUpdate(
        { _id: toGroupId, deleteFlag: false },
        { $push: { blocks: blockId } },
    );
    if (!toGroup) throw new CustomError(errorCodes.BAD_REQUEST);
    const block = await BlockModel.findByIdAndUpdate(
        { _id: blockId, deleteFlag: false },
        { $set: { group_id: toGroupId } },
    );
    if (!block) throw new CustomError(errorCodes.BAD_REQUEST);
    return { fromGroup, toGroup, blockId };
};

const updateListElements = async (data) => {
    const { elmentArr, blockId, elementDeleteArr } = data;
    const block = await Block.findOne({ _id: blockId, deleteFlag: false });
    if (!block) throw new CustomError(errorCodes.BAD_REQUEST);
    // add and update
    for (let i = 0; i < elmentArr.length; i++) {
        let element = elementArr[i];
        if (element._id) {
            let elementUpdate = await ElementModel.findOneandUpdate(
                { _id: element._id, block_id: blockId },
                {
                    $set: {
                        attachment_msg: element.attachment_msg,
                        text_msg: element.text_msg,
                        attribute: element.attribute,
                    },
                },
                { new: true },
            );
            if (!elementUpdate) throw new CustomError(errorCodes.BAD_REQUEST);
        } else {
            let { attachment_msg, text_msg, element_type, attribute } = element;
            let newElment = await ElementModel.create({
                attachment_msg,
                text_msg,
                attribute,
                element_type,
                block_id: blockId,
            });
            let block = await BlockModel.findByIdAndUpdate(
                blockId,
                {
                    $push: { elements: newElment._id },
                },
                { new: true },
            );
        }
    }
    // delete elment
    if (elementDeleteArr.length > 0) {
        for (let i = 0; i < elementDeleteArr.length; i++) {
            let element = elementDeleteArr[i];
            let e = await ElementModel.findByIdAndUpdate(element._id, {
                deleteFlag: true,
            });
        }
    }
};

const uploadImage = (processedFile) => {
    let orgName = processedFile.originalname || ''; // Tên gốc trong máy tính của người upload
    orgName = orgName.trim().replace(/ /g, '-');
    const fullPathInServ = processedFile.path; // Đường dẫn đầy đủ của file vừa đc upload lên server
    // Đổi tên của file vừa upload lên, vì multer đang đặt default ko có đuôi file
    let newFullPath = `${fullPathInServ}-${orgName}`;
    fs.renameSync(fullPathInServ, newFullPath);
    return newFullPath;
};

const getPath = (name) => {
    return path.resolve(`./upload/${name}`);
};

const createEmptyElement = async (data) => {
    const { blockId, element_type } = data;
    let newElment = await ElementModel.create({
        element_type,
        block_id: blockId,
    });
    if (!newElment) throw new CustomError(errorCodes.BAD_REQUEST);
    let block = await BlockModel.findByIdAndUpdate(
        blockId,
        {
            $push: { elements: newElment._id },
        },
        { new: true },
    )
        .populate({ path: 'elements', match: { deleteFlag: false } })
        .exec();
    if (!block) throw new CustomError(errorCodes.BAD_REQUEST);
    return { newElment, block };
};

module.exports = {
    getBlock,
    addBlock,
    updateNameBlock,
    deleteBlock,
    transferBlock,
    updateListElements,
    uploadImage,
    getPath,
    createEmptyElement,
};
