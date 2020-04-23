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
        element_type: {
            type: String,
            enum: [
                'TEXT',
                'IMAGE',
                'AUDIO',
                'VIDEO',
                'LIST',
                'QUESTION_DEFAULT',
                'DATA_CUSTOM',
            ],
            default: 'text',
        },
        // giá trị default của mỗi con block
        attachment_msg: [{ type: Object }],
        text_msg: { type: String },
        // Những element có type = DATA_CUSTOM 
        attribute: { type: String },
        block_id: { type: ObjectId, ref: 'Block' },
        deleteFlag: { type: Boolean, default: false },
    },
    { timestamps: true }
);
var Element = mongoose.model('Element', ElementSchema);
module.exports = Element;
