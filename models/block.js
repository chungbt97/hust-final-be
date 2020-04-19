/**
 * Author: ChungBT
 * Block model
 */
var mongoose = require('mongoose');
var { ObjectId } = mongoose.Types;
var Schema = mongoose.Schema;
var BlockSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        group_id: { type: ObjectId, ref: 'Group' },
        elements: [{ type: Schema.Types.ObjectId, ref: 'Element' }],
        deleteFlag: { type: Boolean, default: false },
    },
    { timestamps: true }
);
var Block = mongoose.model('Block', BlockSchema);
module.exports = Block;
