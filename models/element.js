/**
 * Author: ChungBT
 * Element model
 */
var mongoose = require('mongoose');
var { ObjectId } = mongoose.Types;
var ElementSchema = new mongoose.Schema(
    {
        element_type: {
            type: String,
            enum: ['TEXT', 'IMAGE', 'AUDIO', 'VIDEO', 'LIST', 'DATA_CUSTOM'],
            default: 'TEXT',
        },
        // giá trị default của mỗi con block
        attachment_msg: { type: Object },
        text_msg: { type: String },
        // Những element có type = DATA_CUSTOM
        attribute: { type: String },
        block_id: { type: ObjectId, ref: 'Block' },
        deleteFlag: { type: Boolean, default: false },
    },
    { timestamps: true },
);
var Element = mongoose.model('Element', ElementSchema);
ElementSchema.pre('save', async function (next) {
    if (this.attribute !== null && this.attribute !== undefined) {
        let attributeLower = this.attribute.toLowerCase();
        this.name = attributeLower;
    }
    next();
});
module.exports = Element;
