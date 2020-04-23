const UserModel = require('../models/user');
const GroupModel = require('../models/group');
const BlockModel = require('../models/block');
const ElementModel = require('../models/element');
const BotModel = require('../models/bot');
const AttributeModel = require('../models/attribute');
const blockCodes = require('../constants/block');
const errorCodes = require('../constants/errors');
const userZaloAPI = require('./user');
const { SESSION_TIME } = process.env;

const sendMessage = async (data) => {
    const { event_name, senderId, messageText, messageId, app_id } = data;
    let nextElement = [];
    if (event_name === 'user_send_text') {
        let [bot, user] = await Promise.all([
            BotModel.findOne({ app_id }),
            UserModel.findOne({ user_app_id: senderId }),
        ]);
        let userZalo = await userZaloAPI.getInforUser({
            userId: senderId,
            bot,
        });
        if (!user) {
            let session = generatorSession(senderId);
            user = await UserModel.create({
                name: userZalo.display_name,
                user_app_id: userZalo.user_id,
                current_session: session,
            });
        }
        nextElement = getNextElement({
            message: messageText,
            userId: user._id,
            session: user.current_session,
            botId: bot._id,
        });
        let err = [];
        for (let i = 0; i < nextElement.length; i++) {
            let options = getOptions(nextElement[i]);
            breakFor = false;
            await replyMessage(options).catch((error) => {
                err.push(new CustomError('Lỗi gì đó'));
                breakFor = true;
            });
            if (breakFor) break;
        }
        if (err.length > 0) {
            throw new CustomError('Lỗi gì đó');
            axios.elmentMacDinh();
        }
    } else {
        axios.elmentMacDinh(); // anh chị đợi em 1 chút nhân viên bên em sẽ liên lạc lại ngay
    }
};

const generatorSession = (senderId) => {
    let startTimeMilis = Date.now();
    let endTimeMilis = starTimeMilis + Number(SESSION_TIME);
    return `${senderId}.${startTimeMilis}.${endTimeMilis}`;
};

const verifySesstion = async (session) => {
    let [userId, startTimeMilis, endTimeMilis] = session.split('.');
    let endDateTime = new Date(Number(endTimeMilis));
    let nowDateTime = new Date();
    if (nowDateTime < endDateTime) return true;
    return false;
};

const getNextElement = async (data) => {
    let { message, userId, session, botId } = data;
    let isInSession = verifySesstion(session);
    let nextElementArr = [];
    let currenElementID = '';
    if (!isInSession) {
        let wellcomeBlock = await getDefaultBlockElement(
            botId,
            blockCodes.WELCOME
        );
        nextElementArr.push(wellcomeBlock);
    } else {
        let user = await UserModel.findById(userId);
        let { element_id } = user;
        // Đang hỏi attribute
        if (element_id) {
            let element = await ElementModel.findById({
                _id: element_id,
                deleteFlag: false,
            });
            if (!element)
                throw new CustomError(errorCodes.INTERNAL_SERVER_ERROR);
            let block = await BlockModel.findOne({
                _id: element.block_id,
                deleteFlag: false,
            })
                .populate('elements')
                .exec();
            if (!block) throw new CustomError(errorCodes.INTERNAL_SERVER_ERROR);
            let elements = block.elements;
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
                    blockCodes.ELEMTYPE_DATA_CUSTOM
                ) {
                    nextElementArr.push(block.elements[index + 1]);
                    currenElementID = elements[index + 1]._id;
                } else {
                    // hỏi xong rồi mà vẫn còn element ở sau nữa
                    // lôi hết ra và đưa vào arr
                    elements.forEach((ele, i) => {
                        if (i > indexElement) {
                            nextElementArr.push(ele);
                        }
                    });
                }
            } else {
                let blockDefault = await getDefaultBlockElement(
                    botId,
                    blockCodes.DEFAULT
                );
                nextElementArr.push(blockDefault);
            }
        } else {
            // currenElementID là rỗng tức là gửi  nó hết element của 1 con block lúc nãy rồi
            // Người dùng giờ rep cái mới rồi
            //TO DO
            let nextBlock = phanTichTheoRule(message);
            let dataResult = getElement(nextBlock);
            nextElementArr = dataResult.arrReturn;
            // lấy ra hết element phải cho đến cái có elemtype == DataCusom;
        }
    }
    if (currenElementID !== '') {
        UserModel.findByIdAndUpdate(userId, {
            $set: { element_id: currenElementID },
        });
    }
    return nextElementArr;
};

const addOrUpdateAttribute = (data) => {
    let { userId, nameAttribute, valueAttribute } = data;
    let attr = AttributeModel.find({
        user_id: userId,
        name: nameAttribute,
        deleteFlag: false,
    });
    let attributeExists = false;
    if (attr) {
        AttributeModel.findOneAndUpdate(
            { user_id: userId, name: nameAttribute },
            { $set: { value: valueAttribute } }
        );
        attributeExists = true;
    } else {
        Attributes.create({ user_id: userId, name: attribute, value: message });
    }
    return { attr, attributeExists };
};

const getElement = (block) => {
    let i = 0;
    let arrReturn = [];
    let idReturn = '';
    do {
        arrReturn.push(block.elements[i]);
        if (block.elements[i].element_type == blockCodes.ELEMTYPE_DATA_CUSTOM) {
            idReturn = block.elements[i]._id;
        }
    } while (
        i < block.elements.length &&
        block.elements[i].element_type !== blockCodes.ELEMTYPE_DATA_CUSTOM
    );
    return { arrReturn, idReturn };
};

const phanTichTheoRule = async (message) => {
    return null;
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

const getOptionsByElementType = (element_type, value) => {
    
}