const BotModel = require('../models/bot');
const axios = require('axios').default;
const CustomError = require('../common/CustomError');
const errorCodes = require('../constants/errors');
const { ZALO_ENDPOINT } = require('../constants/index');
const UserModel = require('../models/user');

const getInforUser = async (data) => {
    let { userAppId, tokenApp } = data;
    let url = `${ZALO_ENDPOINT}/getprofile?access_token=${tokenApp}&data={"user_id":"${userAppId}"}`;
    const user = await axios.get(url).catch((error) => {
        throw new CustomError(errorCodes.ZALO_USER_NOT_EXISTS);
    });
    return user.data.data;
};

const findOrCreateUser = async (data) => {
    let { userAppId, botId, tokenApp } = data;
    let user = await UserModel.findOne({ user_app_id: userAppId });
    if (!user) {
        let dataUser = await getInforUser({ userAppId, tokenApp });
        let name = dataUser.display_name;
        user = await UserModel.create({
            name,
            user_app_id: userAppId,
            bot_id: botId,
        });
    }
    return user;
};

const generatorSession = (senderId) => {
    let startTimeMilis = Date.now();
    let endTimeMilis = starTimeMilis + Number(SESSION_TIME);
    return `${senderId}.${startTimeMilis}.${endTimeMilis}`;
};

const verifySesstion = async (session) => {
    if (session !== null) {
        let [userId, startTimeMilis, endTimeMilis] = session.split('.');
        let endDateTime = new Date(Number(endTimeMilis));
        let nowDateTime = new Date();
        if (nowDateTime < endDateTime) return true;
    }
    return false;
};

module.exports = {
    getInforUser,
    generatorSession,
    verifySesstion,
    findOrCreateUser,
};
