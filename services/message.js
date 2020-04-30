const UserModel = require('../models/user');
const GroupModel = require('../models/group');
const BlockModel = require('../models/block');
const ElementModel = require('../models/element');
const BotModel = require('../models/bot');
const AttributeModel = require('../models/attribute');
const blockCodes = require('../constants/block');
const errorCodes = require('../constants/errors');
const userService = require('./user');
const { SESSION_TIME } = process.env;
const { generatorSession, verifySesstion } = require('./user');
const ZALO_ENDPOINT = 'https://openapi.zalo.me/v2.0/oa/message';

const sendMessage = async (data) => {
    const { event_name, messageText, user, bot } = data;
    let nextElement = [];
    if (event_name === 'user_send_text') {
        nextElement = getNextElement({
            message: messageText,
            user,
            botId: bot._id,
        });
        let err = [];
        for (let i = 0; i < nextElement.length; i++) {
            let options = getOptions(nextElement[i], bot.tokenApp);
            breakFor = false;
            await callApiApp(options).catch((error) => {
                err.push(new CustomError(errorCodes.INTERNAL_SERVER_ERROR));
                breakFor = true;
            });
            if (breakFor) break;
        }
        if (err.length > 0) {
            console.log('axios: mặc định');
            throw new err[0]();
        }
    } else {
        console.log('axios: mặc định');
        //axios.elmentMacDinh(); // anh chị đợi em 1 chút nhân viên bên em sẽ liên lạc lại ngay
    }
};

const callApiApp = async (message) => {
    return await axios(options);
};

const getNextElement = async (data) => {
    let { message, user, botId } = data;
    let nextElementArr = [];
    let currenElementID = '';

    let isInSession = verifySesstion(user.current_session);
    if (isInSession) {
        let { element_id } = user;
        // Đang hỏi attribute
        if (element_id !== null) {
            // get list element
            let elements = getListElementsInBlock(element_id);
            // lưu giá trị vào trong bảng attribute
            await addOrUpdateAttribute({
                userId,
                nameAttribute: element.attribute,
                valueAttribute: message,
            });
            // thực hiện update và tìm thằng tiếp theo cần gửi
            let indexElement = 0;
            elements.forEach((ele, index) => {
                if (ele._id === element_id) indexElement = index;
            });

            if (indexElement !== elements.length - 1) {
                // vẫn chưa hỏi xong
                if (
                    elements[indexElement + 1].element_type ===
                    blockCodes.TYPE_DATA_CUSTOM
                ) {
                    nextElementArr.push(block.elements[index + 1]);
                    currenElementID = elements[index + 1]._id;
                } else {
                    let restElement = getRestOfBlock({
                        indexElement,
                        elements,
                    });
                    nextElementArr = restElement.nextElementArr;
                    currenElementID = restElement.currenElementID;
                }
            } else {
                // cảm ơn bạn đã cung câp thông tin bạn có muốn gì nữa không?
            }
        } else {
            // currenElementID là rỗng tức là gửi  nó hết element của 1 con block lúc nãy rồi
            // Người dùng giờ rep cái mới rồi
            //TO DO
            let nextBlock = phanTichTheoRule(message);
            let dataResult = getElement(nextBlock);
            nextElementArr = dataResult.arrReturn;
            currenElementID = dataResult.idReturn;
            // lấy ra hết element phải cho đến cái có elemtype == DataCusom;
        }
    } else {
        // welcome message
    }
    if (currenElementID !== '') {
        UserModel.findByIdAndUpdate(userId, {
            $set: { element_id: currenElementID },
        });
    }
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

/**
 * Từ 1 element lấy ra toàn bộ những Element có trong block
 * @param {} element_id
 */

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
 * Cập nhật giá trị mới cho bảng attribute
 * @param {*} data
 */
const addOrUpdateAttribute = async (data) => {
    let { userId, nameAttribute, valueAttribute } = data;
    let attributeExists = true;
    let attr = await AttributeModel.findOneAndUpdate(
        { user_id: userId, name: nameAttribute },
        { $set: { value: valueAttribute } },
    );
    if (!attr) {
        await Attributes.create({
            user_id: userId,
            name: attribute,
            value: valueAttribute,
        });
        attributeExists = false;
    }
    return { attr, attributeExists };
};

/**
 * Lấy từ element đầu đến element cuối hoặc đến element có type = DATA_CUSTOM
 * @param {*} block
 */
const getElement = (block) => {
    let arrReturn = [];
    let idReturn = null;
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
    return { arrReturn, idReturn };
};

const getDefaultBlockElement = async (botId, code) => {
    let defaultGroup = await GroupModel.findOne({
        bot_id: botId,
        defaultGroup: true,
        deleteFlag: false,
    })
        .populate({
            path: 'blocks',
            match: { deleteFlag: false },
            select: '_id',
        })
        .exec();
    if (!defaultGroup) throw new CustomError(errorCodes.INTERNAL_SERVER_ERROR);
    let id = null;
    if (code === blockCodes.WELCOME) {
        id = defaultGroup.blocks[0]._id;
    } else {
        // code == blockCodes.DEFAULT -- message lỗi
        id = defaultGroup.blocks[1]._id;
    }
    let block = await BlockModel.findById(id).populate('elements').exec();
    return block.elements[0];
};

const getOptions = (element, token, userAppId) => {
    if (!element.attachment_msg) {
        return (options = {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            data: {
                recipient: {
                    user_id: userAppId,
                },
                message: {
                    attachment: element.attachment_msg,
                    text: element.text_msg,
                },
            },
            url: `${ZALO_ENDPOINT}?access_token=${token}`,
        });
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
            url: `${ZALO_ENDPOINT}?access_token=${token}`,
        };
    }
};

const phanTichTheoRule = async (message) => {
    return null;
};

module.exports = { sendMessage };
