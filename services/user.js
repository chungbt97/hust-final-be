const UserModel = require('../models/user');
const BotModel = require('../models/bot');
const axios = require('axios').default;
const CustomError = require('../common/CustomError');
const errorCodes = require('../constants/errors');
const { ZALO_ENDPOINT } = require('../constants/index');

const getInforUser = async (data) => {
    let { userId, bot } = data;
    let { tokenApp } = bot;
    const user = await axios
        .get(
            `${ZALO_ENDPOINT}/getprofile?access_token=${tokenApp}&data={"user_id":"${userId}"}`
        )
        .catch((error) => {
            throw new CustomError(errorCodes.ZALO_USER_NOT_EXISTS);
        });
    return user;
};

module.exports = { getInforUser };
