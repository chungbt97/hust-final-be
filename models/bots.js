var mongoose = require('mongoose');
var BotSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
    },
    createdAt: Number,
    updatedAt: Number,
    deleteFlag: Boolean,
});
var Bot = mongoose.model('Bot', BotSchema);
module.exports = Bot;
