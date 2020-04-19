/**
 * Author: ChungBT
 * Element model
 */
var mongoose = require('mongoose');
var { ObjectId } = mongoose.Types;
var ElementSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        elements: {
            type: String,
            enum: ['text', 'image', 'audio', 'video', 'template', 'question'],
            default: 'text',
        },
        block_id: { type: ObjectId, ref: 'Block' },
        deleteFlag: { type: Boolean, default: false },
    },
    { timestamps: true }
);
var Element = mongoose.model('Element', ElementSchema);
module.exports = Element;
