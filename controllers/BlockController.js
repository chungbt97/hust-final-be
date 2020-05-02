/**
 * Author: ChungBT
 * Controller handle request to Block
 */
const blockService = require('../services/block');

// route;   :botId/group/:groupId/block/:blockId
const getContentBlock = async (req, res) => {
    const { groupId, botId, blockId } = req.params;
    const block = await blockService.getBlock({ groupId, botId, blockId });
    return res.send({
        status: 200,
        message: 'Ok',
        data: block,
    });
};

//route: :botId/group/:groupId/block
const addNewBlock = async (req, res) => {
    const { groupId, botId } = req.params;
    const { name } = req.body;
    const block = await blockService.addBlock({ groupId, botId, name });
    return res.send({
        status: 201,
        message: 'Created block.',
        data: block,
    });
};

// route: :botId/group/:groupId/block/:blockId
const updateNameBlock = async (req, res) => {
    const { groupId, botId, blockId } = req.params;
    const { name } = req.body;
    const block = await blockService.updateNameBlock({
        botId,
        groupId,
        blockId,
        name,
    });
    return res.send({
        status: 200,
        message: 'Ok',
        data: block,
    });
};

// route: :botId/group/:groupId/block/:blockId
const deleteBlock = async (req, res) => {
    let { botId, groupId, blockId } = req.params;
    let block = await blockService.deleteBlock({ botId, groupId, blockId });
    return res.send({
        status: 200,
        message: 'Ok',
        data: block,
    });
};

// route: :botId/group/:groupId/block/:blockId
const transferBlock = async (req, res) => {
    const { botId, groupId, blockId } = req.params;
    const { toGroupId } = req.body;
    let block = await blockService.transferBlock({
        botId,
        blockId,
        fromGroupId: groupId,
        toGroupId,
    });
    return res.send({
        status: 200,
        message: 'Ok',
        data: block,
    });
};

const createEmptyElement = async (req, res) => {
    const { blockId } = req.params;
    const { element_type, preId } = req.body;
    let data = await blockService.createEmptyElement({
        blockId,
        element_type,
        preId,
    });
    return res.send({
        status: 201,
        message: 'Created',
        data,
    });
};

const updateElements = async (req, res) => {
    const { botId, groupId, blockId } = req.params;
    const { elements, name } = req.body;
    let block = await blockService.updateListElements({
        elements,
        blockId,
        name,
    });
    return res.send({
        status: 200,
        message: 'Ok',
        data: block,
    });
};

const uploadImage = async (req, res) => {
    const { file } = req;
    let newFullPath = blockService.uploadImage(file);
    res.send({
        status: 200,
        message: 'File uploaded',
        fileNameInServer: newFullPath,
    });
};

const getImage = async (req, res) => {
    const { name } = req.params;
    if (!name) {
        return res.send({
            status: false,
            message: 'no filename specified',
        });
    }
    const path = blockService.getPath(name);
    res.sendFile(path);
};

const deleteElement = async (req, res) => {
    let { botId, groupId, blockId, elementId } = req.params;
    let block = await blockService.deleteElement({
        botId,
        groupId,
        blockId,
        elementId,
    });
    return res.send({
        status: 200,
        message: 'Ok',
        data: block,
    });
};

module.exports = {
    getContentBlock,
    addNewBlock,
    updateNameBlock,
    deleteBlock,
    transferBlock,
    updateElements,
    uploadImage,
    getImage,
    createEmptyElement,
    deleteElement,
};
