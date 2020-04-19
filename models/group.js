/**
 * Author: ChungBT
 * Groups model
 */
var commonMethod = require('../common/index');
var BlockModel = require('./Block');
var mongoose = require('mongoose');
var { ObjectId } = mongoose.Types;
var Schema = mongoose.Schema;
var GroupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        defaultGroup: { type: Boolean, default: false },
        blocks: [{type: ObjectId, ref: 'Block'}],
        bot_id: { type: ObjectId, ref: 'Bot' },
        deleteFlag: { type: Boolean, default: false },
    },
    { timestamps: true }
);

GroupSchema.pre('save', async function (next) {
    if (this.defaultGroup) {
        let arrBlock = commonMethod.createDefaultBlock(this._id);
        let defaultBlock = await BlockModel.create(arrBlock);
        if (!defaultBlock)
            throw new CustomError(errorCodes.INTERNAL_SERVER_ERROR);
        this.blocks = defaultBlock;
    }
    next();
});
var Group = mongoose.model('Group', GroupSchema);
module.exports = Group;
