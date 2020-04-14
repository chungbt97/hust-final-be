/**
 * Author: ChungBT
 * Account model
 */
var mongoose = require('mongoose');
var md5 = require('md5');
var accountSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        userEmail: { type: String, required: true, trim: true },
        password: { type: String, required: true, trim: true },
    },
    { timestamps: true }
);
accountSchema.pre('save', async function (next) {
    let md5Password = md5(this.password);
    this.password = md5Password;
    next();
});
var Account = mongoose.model('Account', accountSchema);
module.exports = Account;
