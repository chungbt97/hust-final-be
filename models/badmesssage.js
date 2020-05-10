/**
 * Author: ChungBT
 * Bad message Model
 */
var mongoose = require('mongoose');
var { ObjectId } = mongoose.Types;
var BadMessageSchema = new mongoose.Schema(
    {
        user_id: { type: ObjectId, ref: 'User', require: true },
        message_id: { type: String, require: true, trim: true },
        user_name: { type: String, require: true, trim: true },
        event_name: { type: String, require: true, trim: true },
        deleteFlag: { type: Boolean, default: false },
    },
    { timestamps: true },
);

var BadMessage = mongoose.model('BadMessage', BadMessageSchema);
module.exports = BadMessage;
