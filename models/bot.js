/**
 * Author: ChungBT
 * Bot model
 */
var mongoose = require('mongoose');
var { ObjectId } = mongoose.Types;
var Schema = mongoose.Schema;
var BotSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
        },
        keyApp: { type: String, trim: true },
        tokenApp: { type: String, trim: true },
        user_id: { type: ObjectId, ref: 'Account' },
        deleteFlag: { type: Boolean, default: false },
    },
    { timestamps: true }
);
var Bot = mongoose.model('Bot', BotSchema);
module.exports = Bot;
