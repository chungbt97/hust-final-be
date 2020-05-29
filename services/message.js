const UserModel = require('../models/user');
const GroupModel = require('../models/group');
const BlockModel = require('../models/block');
const ElementModel = require('../models/element');
const RuleModel = require('../models/rule');
const BotModel = require('../models/bot');
const BadMessageModel = require('../models/badmesssage');
const AttributeModel = require('../models/attribute');
const blockCodes = require('../constants/block');
const errorCodes = require('../constants/errors');
const CustomError = require('../common/CustomError');
const axios = require('axios').default;
const userService = require('./user');
const { SESSION_TIME } = process.env;
const { generatorSession, verifySesstion } = require('./user');
const {
    ZALO_ENDPOINT,
    MSG_SHARE_INFO,
    MSG_DEFAULT_ERR,
} = require('../constants');
var { ES_ENDPOINT } = require('../constants');
const urlencode = require('urlencode');

const sendMessage = async (data) => {
    const { event_name, messageText, user, bot, msgId, info } = data;
    let nextElement = [];
    if (event_name === 'user_send_text') {
        nextElement = await getNextElement({
            message: messageText,
            user,
            bot,
        });
        let err = [];
        for (let i = 0; i < nextElement.length; i++) {
            let options = fillDataToOption(
                nextElement[i],
                bot.tokenApp,
                user.user_app_id,
            );
            breakFor = false;
            await callApiApp(options).then((res) => {
                let { error, message } = res.data;
                if (error !== 0) {
                    err.push(new CustomError(error));
                }
            });
            if (breakFor) break;
        }
        if (err.length > 0) {
            throw err[0];
        }
    } else if (event_name === 'user_submit_info') {
        const { address, phone, city, district, name } = info;
        await userService.saveInfoShare({
            name,
            address,
            phone,
            city,
            district,
            userId: user._id,
            userAppId: user.user_app_id,
            botId: bot._id,
        });
        await callApiAppDefault(
            bot.name,
            user.user_app_id,
            MSG_SHARE_INFO,
            bot.tokenApp,
        );
    } else {
        await BadMessageModel.create({
            user_id: user._id,
            message_id: msgId,
            user_name: user.name,
            event_name,
        });
        await callApiAppDefault(
            bot.name,
            user.user_app_id,
            MSG_DEFAULT_ERR,
            bot.tokenApp,
        );
    }
};

const requestShareInfo = async (data) => {
    const { user, bot } = data;
    let dataSend = {
        recipient: {
            user_id: user.user_app_id,
        },
        message: {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'request_user_info',
                    elements: [
                        {
                            title: `Chia sẻ thông tin với ${bot.name}`,
                            subtitle: `Tất cả thông tin được chia sẻ đều được bảo mật thông qua Zalo.`,
                            image_url: bot.avatar,
                        },
                    ],
                },
            },
        },
    };
    let option = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        data: dataSend,
        params: { access_token: bot.tokenApp },
        url: `https://openapi.zalo.me/v2.0/oa/message`,
    };
    await callApiApp(option);
};

const callApiAppDefault = async (botName, userAppId, msg, token) => {
    let options = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        data: {
            recipient: {
                user_id: userAppId,
            },
            message: {
                text: `${botName} ${msg}`,
            },
        },
        url: `${ZALO_ENDPOINT}/message?access_token=${token}`,
    };
    await callApiApp(options);
};

const callApiApp = async (options) => {
    return await axios(options);
};

const getNextElement = async (data) => {
    let { message, user, bot } = data;
    let nextElementArr = [];
    let currenElementID = null;

    let isInSession = verifySesstion(user.current_session);
    if (isInSession) {
        let { element_id } = user;
        if (
            element_id !== null &&
            element_id !== undefined &&
            element_id !== ''
        ) {
            // get list element
            let elements = await getListElementsInBlock(element_id);
            let element = await ElementModel.findById(element_id);
            // lưu giá trị vào trong bảng attribute
            await userService.addOrUpdateAttribute({
                userId: user._id,
                userAppId: user.user_app_id,
                nameAttribute: element.attribute,
                valueAttribute: message,
                botId: bot._id,
            });
            // thực hiện update và tìm thằng tiếp theo cần gửi
            let indexElement = 0;
            elements.forEach((ele, index) => {
                if (ele._id.toString() === element_id.toString())
                    indexElement = index;
            });
            if (indexElement !== elements.length - 1) {
                // vẫn chưa hỏi xong
                if (
                    elements[indexElement + 1].element_type ===
                    blockCodes.TYPE_DATA_CUSTOM
                ) {
                    nextElementArr.push(elements[indexElement + 1]);
                    currenElementID = elements[indexElement + 1]._id;
                } else {
                    let restElement = getRestOfBlock({
                        indexElement,
                        elements,
                    });
                    nextElementArr = restElement.nextElementArr;
                    currenElementID = restElement.currenElementID;
                }
            } else {
            }
        } else {
            // currenElementID là rỗng tức là gửi  nó hết element của 1 con block lúc nãy rồi
            // Người dùng giờ rep cái mới rồi
            //TO DO
            let nextBlock = await getBlockFromRuleByMsg(message, bot._id);
            let dataResult = getElement(nextBlock);
            nextElementArr = dataResult.arrReturn;
            if (
                dataResult.idReturn !== null &&
                dataResult.idReturn !== undefined
            ) {
                currenElementID = dataResult.idReturn;
            }

            // lấy ra hết element phải cho đến cái có elemtype == DataCusom;
        }
    } else {
        // welcome message
        let welcomeBlock = await getDefaultBlockElement(
            bot._id,
            blockCodes.WELCOME,
        );
        let dataResult = getElement(welcomeBlock);
        nextElementArr = dataResult.arrReturn;
        currenElementID = dataResult.idReturn;
        // create session
        if (
            user.current_session !== null &&
            user.current_session !== undefined
        ) {
            await UserModel.findByIdAndUpdate(user._id, {
                $push: { old_session: user.current_session },
            });
        }
    }

    // tạo mới session
    let newSession = generatorSession(user.user_app_id);
    await UserModel.findByIdAndUpdate(user._id, {
        $set: { element_id: currenElementID, current_session: newSession },
    });

    return nextElementArr;
};

/**
 * Lấy elemet còn lại trong block đến hết hoặc đến câu hỏi attribute kế tiếp
 * @param {*} data
 */
const getRestOfBlock = (data) => {
    let { indexElement, elements } = data;
    let nextElementArr = [];
    let currenElementID = null;
    // hỏi xong rồi mà vẫn còn element ở sau nữa
    // push đến khi gặp được chuỗi tiếp theo hoặc hết
    for (let i = indexElement + 1; i < elements.length; i++) {
        if (elements[i].element_type !== blockCodes.TYPE_DATA_CUSTOM) {
            nextElementArr.push(elements[i]);
        } else {
            nextElementArr.push(elements[i]);
            currenElementID = elements[i]._id;
            break;
        }
    }

    return { nextElementArr, currenElementID };
};

const getListElementsInBlock = async (element_id) => {
    let element = await ElementModel.findById({
        _id: element_id,
        deleteFlag: false,
    });
    if (!element) throw new CustomError(errorCodes.INTERNAL_SERVER_ERROR);
    let block = await BlockModel.findOne({
        _id: element.block_id,
        deleteFlag: false,
    })
        .populate('elements')
        .exec();
    if (!block) throw new CustomError(errorCodes.INTERNAL_SERVER_ERROR);
    return block.elements;
};

/**
 * Lấy từ element đầu đến element cuối hoặc đến element có type = DATA_CUSTOM
 * @param {*} block
 */
const getElement = (block) => {
    let arrReturn = [];
    let idReturn = null;
    if (block !== null) {
        let elements = block.elements;
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].element_type !== blockCodes.TYPE_DATA_CUSTOM) {
                arrReturn.push(elements[i]);
            } else {
                arrReturn.push(elements[i]);
                idReturn = elements[i]._id;
                break;
            }
        }
    }
    return { arrReturn, idReturn };
};

const getDefaultBlockElement = async (botId, code) => {
    let defaultGroup = await GroupModel.findOne({
        bot_id: botId,
        defaultGroup: true,
    })
        .populate({
            path: 'blocks',
            match: { deleteFlag: false },
            select: '_id name elements',
        })
        .exec();
    if (!defaultGroup) throw new CustomError(errorCodes.INTERNAL_SERVER_ERROR);
    let block = null;
    if (code === blockCodes.WELCOME) {
        block = defaultGroup.blocks[0];
    } else {
        block = defaultGroup.blocks[1];
    }
    block = await block
        .populate({ path: 'elements', match: { deleteFlag: false } })
        .execPopulate();
    return block;
};

const fillDataToOption = (element, token, userAppId) => {
    if (element.attachment_msg) {
        return {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            data: {
                recipient: {
                    user_id: userAppId,
                },
                message: {
                    attachment: element.attachment_msg,
                    text: element.text_msg !== null ? element.text_msg : '',
                },
            },
            url: `${ZALO_ENDPOINT}/message?access_token=${token}`,
        };
    } else {
        return {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            data: {
                recipient: {
                    user_id: userAppId,
                },
                message: {
                    text: element.text_msg,
                },
            },
            url: `${ZALO_ENDPOINT}/message?access_token=${token}`,
        };
    }
};

const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
};

const getBlockFromRuleByMsg = async (message, botId) => {
    const allRules = await RuleModel.find({ bot_id: botId, deleteFlag: false })
        .populate('blocks')
        .exec();
    const ruleContain = [];
    allRules.forEach((rule) => {
        let arrayKeyword = rule.keyword.split(',');
        for (let i = 0; i < arrayKeyword.length; i++) {
            if (
                new RegExp(arrayKeyword[i].trim().toLowerCase()).test(
                    message.trim().toLowerCase(),
                )
            ) {
                ruleContain.push(rule);
                break;
            }
        }
    });
    //TO DO Check lai ES
    if (ruleContain.length > 1) {
        const blocks = ruleContain[0].blocks;
        const randomNumber = getRandomInt(blocks.length);
        let block = await blocks[randomNumber]
            .populate({
                path: 'elements',
                match: { deleteFlag: false },
            })
            .execPopulate();
        return block;
    } else if (ruleContain.length === 0) {
        let block = getRuleByElasticSearch(message, botId);
        return block;
    } else {
        let encodeMsg = urlencode(message.trim().toLowerCase());
        const result = await axios.get(`${ES_ENDPOINT}/rules/_search?q=${encodeMsg}`);
        let rules = result.data.hits.hits;
        if (rules.length === 0) {
            let block = getDefaultBlockElement(botId, blockCodes.DEFAULT);
            return block;
        }
        let rule = getRuleContain(ruleContain, rules);
        const blocks = rule.blocks;
        const randomNumber = getRandomInt(blocks.length);
        let block = await blocks[randomNumber]
            .populate({
                path: 'elements',
                match: { deleteFlag: false },
            })
            .execPopulate();
        return block;
    }
};

const getRuleContain = (ruleContain, rules) => {
    for (let i = 0; i < rules.length; i++) {
        for (let j = 0; j < ruleContain.length; j++) {
            if (rules[i]._id === ruleContain[j]._id.toString()) {
                return ruleContain[j];
            }
        }
    }
    return ruleContain[0];
};

const getRuleByElasticSearch = async (message, botId) => {
    let encodeMsg = urlencode(message.trim().toLowerCase());

    const result = await axios.get(`${ES_ENDPOINT}/_search?q=${encodeMsg}`);
    const rawRule = result.data.hits.hits[0];
    let block = null;
    if (rawRule !== null && rawRule !== undefined) {
        const rule = await RuleModel.findOne({
            _id: rawRule._id,
            bot_id: botId,
            deleteFlag: false,
        })
            .populate('blocks')
            .exec();
        const blocks = rule.blocks;

        const randomNumber = getRandomInt(blocks.length);
        if (blocks.length > 0) {
            block = await blocks[randomNumber]
                .populate({
                    path: 'elements',
                    match: { deleteFlag: false },
                })
                .execPopulate();
        }
    } else {
        block = getDefaultBlockElement(botId, blockCodes.DEFAULT);
    }
    return block;
};

module.exports = {
    sendMessage,
    getElement,
    fillDataToOption,
    requestShareInfo,
    callApiAppDefault,
};
