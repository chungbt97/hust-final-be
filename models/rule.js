/**
 * Author: ChungBT
 * Rule model
 */
var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
var { ObjectId } = mongoose.Types;
var RuleSchema = new mongoose.Schema(
    {
        keyword: {
            type: String,
            required: true,
            trim: true,
            es_indexed: true,
        },
        blocks: [{ type: ObjectId, ref: 'Block' }],
        bot_id: { type: ObjectId, ref: 'Bot', es_indexed: true },
        texts: [{ type: String }],
        deleteFlag: { type: Boolean, default: false, es_indexed: true },
    },
    { timestamps: true },
);
RuleSchema.plugin(mongoosastic, {
    host: 'localhost',
    port: 9200,
});
var Rule = mongoose.model('Rule', RuleSchema);
Rule.createMapping((err, mapping) => {
    console.log('mapping created');
});
module.exports = Rule;
