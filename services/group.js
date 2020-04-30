/**
 * Author: ChungBT
 * Logic with groups
 */

const CustomError = require('../common/CustomError');
const errorCodes = require('../constants/errors');
const GroupModel = require('../models/group');
const BlockModel = require('../models/block');
const BotModel = require('../models/bot');
const blockService = require('./block');

const getGroupOfBot = async (botId) => {
    let groups = await GroupModel.find({
        bot_id: botId,
        deleteFlag: false,
    })
        .populate({
            path: 'blocks',
            match: { deleteFlag: false },
            select: '_id name',
        })
        .exec();
    if (!groups) throw new CustomError(errorCodes.INTERNAL_SERVER_ERROR);
    return groups;
};

const addNewGroupToBot = async (data) => {
    const { botId, name } = data;
    const bot = await BotModel.findOne({ _id: botId, deleteFlag: false });
    if (!bot) throw new CustomError(errorCodes.BAD_REQUEST);
    let newGroup = await GroupModel.create({
        name,
        bot_id: botId,
        blocks:[]
    });
    return newGroup;
};

const updateGroup = async (data) => {
    const { name, groupId, botId } = data;
    let group = await GroupModel.findOneAndUpdate(
        { _id: groupId, bot_id: botId, deleteFlag: false },
        { name: name },
        {
            new: true,
        },
    );
    group = group
        .populate({
            path: 'blocks',
            match: { deleteFlag: false },
            select: '_id name',
        })
        .execPopulate();
    if (!group) throw new CustomError(errorCodes.BAD_REQUEST);
    return group;
};

const deleteGroup = async (data) => {
    const { groupId, botId } = data;
    const blockBeDeleted = await blockService.deleteBlock({ groupId, botId });
    let group = await GroupModel.findOneAndUpdate(
        { _id: groupId },
        { deleteFlag: true },
        {
            new: true,
        },
    );
    group = group
        .populate({
            path: 'blocks',
            match: { deleteFlag: false },
            select: '_id name',
        })
        .execPopulate();
    if (!group) throw new CustomError(errorCodes.BAD_REQUEST);
    return group;
};
module.exports = { getGroupOfBot, addNewGroupToBot, updateGroup, deleteGroup };
