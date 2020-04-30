/**
 * Author: ChungBT
 * Rule model
 */
var mongoose = require('mongoose');
var { ObjectId } = mongoose.Types;
var RuleSchema = new mongoose.Schema(
    {
        keyword: {
            type: String,
            required: true,
            trim: true,
        },
        blocks: [{ type: ObjectId, ref: 'Block' }],
        bot_id: { type: ObjectId, ref: 'Bot' },
        texts: [{ type: String }],
        deleteFlag: { type: Boolean, default: false },
    },
    { timestamps: true },
);

var Rule = mongoose.model('Rule', RuleSchema);
module.exports = Rule;
