const CustomError = require('../common/CustomError');
const errorCodes = require('../constants/errors');
const GroupModel = require('../models/group');
const BlockModel = require('../models/block');
const ElementModel = require('../models/element');

const fs = require('fs');
const path = require('path');
var mongoose = require('mongoose');


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
    const { elements, blockId, name } = data;
    const block = await BlockModel.findOneAndUpdate(
        { _id: blockId, deleteFlag: false },
        { name: name },
    );
    if (!block) throw new CustomError(errorCodes.BAD_REQUEST);
    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        let elementUpdate = await ElementModel.findByIdAndUpdate(
            { _id: element._id },
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
    const { blockId, element_type, preId } = data;
    let newElement = await ElementModel.create({
        element_type,
        block_id: blockId,
    });
    if (!newElement) throw new CustomError(errorCodes.BAD_REQUEST);

    let block = await BlockModel.findById(blockId);
    let newArrElement = block.elements;
    if (preId === null || preId === undefined) {
        newArrElement.push(newElement._id);
    } else {
        let arr = [];
        newArrElement.forEach((eleId) => {
            arr.push(eleId);
            let id = eleId.toString();
            if (id === preId) {
                arr.push(newElement._id);
            }
        });
        newArrElement = arr;
    }
    block = await BlockModel.findByIdAndUpdate(
        blockId,
        {
            elements: newArrElement,
        },
        { new: true },
    )
        .populate({ path: 'elements', match: { deleteFlag: false } })
        .exec();

    if (!block) throw new CustomError(errorCodes.BAD_REQUEST);

    return { newElement, block };
};

const deleteElement = async (data) => {
    const { botId, groupId, blockId, elementId } = data;
    const group = await GroupModel.find({
        _id: groupId,
        bot_id: botId,
        deleteFlag: false,
    });
    if (!group) throw new CustomError(errorCodes.BAD_REQUEST);
    const element = await ElementModel.findOneAndUpdate(
        { _id: elementId, deleteFlag: false, block_id: blockId },
        { deleteFlag: true },
        { new: true },
    );
    const block = await BlockModel.findByIdAndUpdate(blockId, {
        $pull: { elements: elementId },
    })
        .populate({ path: 'elements', match: { deleteFlag: false } })
        .exec();

    if (!element) throw new CustomError(errorCodes.BAD_REQUEST);
    return block;
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
    deleteElement,
};
