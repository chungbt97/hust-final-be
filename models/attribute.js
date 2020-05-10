/**
 * Author: ChungBT
 * Bad message Model
 */
var mongoose = require('mongoose');
var { ObjectId } = mongoose.Types;
var AttributeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        user_id: { type: ObjectId, ref: 'User', require: true },
        value: { type: String },
        deleteFlag: { type: Boolean, default: false },
    },
    { timestamps: true }
);

var Attribute = mongoose.model('Attribute', AttributeSchema);
AttributeSchema.pre('save', async function (next) {
    let nameLower = this.name.toLowerCase();
    this.name = nameLower;
    next();
});
module.exports = Attribute;
