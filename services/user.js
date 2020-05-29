const BotModel = require('../models/bot');
const AttributeModel = require('../models/attribute');
const axios = require('axios').default;
const CustomError = require('../common/CustomError');
const errorCodes = require('../constants/errors');
const { ZALO_ENDPOINT } = require('../constants/index');
const UserModel = require('../models/user');

const { SESSION_TIME } = process.env;

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
    let user = null;
    let newUser = false;
    user = await UserModel.findOne({ user_app_id: userAppId });
    if (!user) {
        let dataUser = await getInforUser({ userAppId, tokenApp });
        let name = dataUser.display_name;
        let avatar = Object.values(dataUser.avatars)[1];
        user = await UserModel.create({
            name,
            user_app_id: userAppId,
            bot_id: botId,
            avatar,
        });
        if (dataUser.shared_info !== undefined) {
            const {
                address,
                phone,
                city,
                district,
                name,
            } = dataUser.shared_info;
            await saveInfoShare({
                name,
                address,
                phone,
                city,
                district,
                userId: user._id,
                userAppId,
                botId,
            });
        } else {
            await AttributeModel.create({
                user_id: user._id,
                name: 'zalo_name',
                value: name,
                user_app_id: userAppId,
                bot_id: botId,
            });
        }
        newUser = true;
    }
    return { user, newUser };
};

const saveInfoShare = async (data) => {
    const {
        name,
        address,
        phone,
        city,
        district,
        userId,
        userAppId,
        botId,
    } = data;
    await Promise.all([
        addOrUpdateAttribute({
            userId: userId,
            userAppId: userAppId,
            nameAttribute: 'zalo_name',
            valueAttribute: name,
            botId: botId,
        }),
        addOrUpdateAttribute({
            userId: userId,
            userAppId: userAppId,
            nameAttribute: 'zalo_address',
            valueAttribute: address,
            botId: botId,
        }),
        addOrUpdateAttribute({
            userId: userId,
            userAppId: userAppId,
            nameAttribute: 'zalo_phone',
            valueAttribute: phone,
            botId: botId,
        }),
        addOrUpdateAttribute({
            userId: userId,
            userAppId: userAppId,
            nameAttribute: 'zalo_city',
            valueAttribute: city,
            botId: botId,
        }),
        addOrUpdateAttribute({
            userId: userId,
            userAppId: userAppId,
            nameAttribute: 'zalo_district',
            valueAttribute: district,
            botId: botId,
        }),
    ]);
};

const addOrUpdateAttribute = async (data) => {
    let { userId, nameAttribute, valueAttribute, userAppId, botId } = data;
    if (
        valueAttribute !== undefined &&
        valueAttribute !== null &&
        valueAttribute !== ''
    ) {
        let attributeExists = true;
        let attr = await AttributeModel.findOneAndUpdate(
            { user_id: userId, name: nameAttribute },
            { $set: { value: valueAttribute } },
        );
        if (!attr) {
            await AttributeModel.create({
                user_id: userId,
                name: nameAttribute,
                value: valueAttribute,
                user_app_id: userAppId,
                bot_id: botId,
            });
            attributeExists = false;
        }
        return { attr, attributeExists };
    }
    return null;
};

const generatorSession = (senderId) => {
    let startTimeMilis = Date.now();
    let endTimeMilis = startTimeMilis + Number(SESSION_TIME);
    return `${senderId}.${startTimeMilis}.${endTimeMilis}`;
};

const verifySesstion = (session) => {
    if (session !== null && session !== undefined) {
        let [userId, startTimeMilis, endTimeMilis] = session.split('.');
        let nowDateTime = new Date();
        let endDateTime = new Date(Number(endTimeMilis));
        if (nowDateTime < endDateTime) return true;
    }
    return false;
};

const getAllDataUser = async (data) => {
    const { botId, attr, value, query } = data;
    let queryParams = {};
    if (attr !== '' && value !== '') {
        if (query === 'is') {
            queryParams = {
                name: attr,
                value,
                bot_id: botId,
            };
        } else {
            queryParams = {
                name: attr,
                value: { $ne: value },
                bot_id: botId,
            };
        }
    } else {
        queryParams = {
            bot_id: botId,
        };
    }
    let listUserFilter = await AttributeModel.find(queryParams).distinct(
        'user_id',
    );
    const usersRaw = await UserModel.find({
        bot_id: botId,
        _id: { $in: listUserFilter },
    });

    let users = [];
    for (let i = 0; i < usersRaw.length; i++) {
        let user = handleRawDataUser(usersRaw[i]);
        let [totalAttribute, zalo_phone] = await Promise.all([
            AttributeModel.find({ bot_id: botId, user_id: user._id }).count(),
            AttributeModel.find({
                bot_id: botId,
                user_id: user._id,
                name: 'zalo_phone',
            }),
        ]);
        user.phone =
            zalo_phone[0] !== undefined ? zalo_phone[0].value : user._id;
        user.totalAttribute = totalAttribute;
        users.push(user);
    }
    return users;
};

const handleRawDataUser = (raw) => {
    let user = { phone: '', totalAttribute: 0 };
    user._id = raw._id;
    user.zaloId = raw.user_app_id;
    user.name = raw.name;
    user.key = raw.user_app_id;
    user.avatar = raw.avatar;
    let lastSeenDate =
        raw.current_session !== undefined
            ? new Date(Number(raw.current_session.split('.')[1]))
            : new Date();
    user.lastSeen = `${lastSeenDate.getDate()}-${
        lastSeenDate.getMonth() + 1
    }-${lastSeenDate.getFullYear()}`;
    let signUpDate = new Date(raw.createdAt);
    user.signUp = `${signUpDate.getDate()}-${
        signUpDate.getMonth() + 1
    }-${signUpDate.getFullYear()}`;
    user.totalSession = raw.old_session.length;
    return user;
};

const getAllData = async (botId) => {
    const bot = await BotModel.findById(botId);
    if (!bot) return new CustomError(errorCodes.BOT_NOT_EXISTS);
    const listData = await AttributeModel.find({
        bot_id: botId,
        deleteFlag: false,
    });
    return listData;
};

const getDistinNameAttribute = async (botId) => {
    const bot = await BotModel.findById(botId);
    if (!bot) return new CustomError(errorCodes.BOT_NOT_EXISTS);
    const listAttr = await AttributeModel.find({
        bot_id: botId,
        deleteFlag: false,
    }).distinct('name');
    return listAttr;
};

const countTotalSesions = async (botId) => {
    const usersRaw = await UserModel.find({
        bot_id: botId,
    });
    let sessions = 0;
    usersRaw.forEach((user) => {
        sessions += user.old_session.length;
    });
    return sessions;
};

module.exports = {
    getInforUser,
    generatorSession,
    verifySesstion,
    getAllDataUser,
    findOrCreateUser,
    getAllData,
    getDistinNameAttribute,
    countTotalSesions,
    saveInfoShare,
    addOrUpdateAttribute,
};
