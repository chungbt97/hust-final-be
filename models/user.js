/**
 * Author: ChungBT
 * User of zalo bot
 */
var mongoose = require('mongoose');
var { ObjectId } = mongoose.Types;
var UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        user_app_id: { type: String, required: true },
        current_session: { type: String },
        old_session: [{ type: String }],
        element_id: { type: ObjectId, ref: 'Element' },  
    },
    { timestamps: true }
);

var User = mongoose.model('User', UserSchema);
module.exports = User;
