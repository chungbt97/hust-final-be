/**
 * Author: ChungBT
 * Validator request
 */

const { body, validationResult, param } = require('express-validator');
const actionTypes = require('../constants/action');
const fieldName = require('../constants/fieldname');
const errorsCodes = require('../constants/errors');
const CustomError = require('./CustomError');

/**
 * main validate function
 * @param {Action code} action
 */
function validateAction(action) {
    switch (action) {
        case actionTypes.SIGN_IN: {
            return [
                body('userEmail')
                    .exists()
                    .withMessage(`${fieldName.Email} is required`)
                    .isEmail()
                    .withMessage('Email không hợp lệ')
                    .isString()
                    .trim(),
                body('password')
                    .exists()
                    .withMessage(`Bạn cần nhập mật khẩu`)
                    .isString()
                    .trim(),
            ];
        }
        case actionTypes.SIGN_UP: {
            return [
                body('firstName')
                    .exists()
                    .withMessage(`${fieldName.FIRST_NAME} chưa nhập`)
                    .isString()
                    .trim(),
                body('lastName')
                    .exists()
                    .withMessage(`${fieldName.LAST_NAME} chưa nhập`)
                    .isString()
                    .trim(),
                body('userEmail')
                    .exists()
                    .withMessage(`${fieldName.Email} chưa nhập`)
                    .isEmail()
                    .withMessage('Email không hợp lệ')
                    .isString()
                    .trim(),
                body('password')
                    .exists()
                    .withMessage(`${fieldName.PASSWORD}chưa nhập`)
                    .isString()
                    .trim(),
            ];
        }
        case actionTypes.GET_DATA_BOT: {
            return [param('botId').exists().withMessage(`Thông tin Bot yêu cầu không hợp lệ`)];
        }
        case actionTypes.DELETE_BOT: {
            return param('botId').exists().withMessage('Thông tin bot yêu cầu không đúng');
        }
        case actionTypes.GET_ALL_GROUP: {
            return param('botId').exists().withMessage(`Thông tin bot yêu cầu không đúng`);
        }
        case actionTypes.ADD_NEW_GROUP: {
            return [
                param('botId').exists().withMessage(`Thông tin bot yêu cầu không đúng`),
                body('name')
                    .exists()
                    .withMessage('Tên của nhóm hành động không đúng')
                    .isString()
                    .trim(),
            ];
        }
        case actionTypes.UPDATE_GROUP: {
            return [
                param('botId').exists().withMessage(`Thông tin bot yêu cầu không đúng`),
                param('groupId').exists().withMessage(`Thông tin nhóm yêu cầu không đúng`),
                body('name')
                    .exists()
                    .withMessage(`Tên nhóm yêu cầu không thể để trống `)
                    .isString()
                    .trim(),
            ];
        }
        case actionTypes.DELETE_GROUP: {
            return [
                param('botId').exists().withMessage(`Thông tin bot yêu cầu không đúng`),
                param('groupId').exists().withMessage(`Thông tin nhóm yêu cầu không đúng`),
            ];
        }
        case actionTypes.GET_CONTENT_BLOCK: {
            return [
                param('botId').exists().withMessage(`Thông tin bot yêu cầu không đúng`),
                param('groupId').exists().withMessage(`Thông tin nhóm yêu cầu không đúng`),
                param('blockId').exists().withMessage(`Thông tin hành động không đúng`),
            ];
        }
        case actionTypes.ADD_NEW_BLOCK: {
            return [
                param('botId').exists().withMessage(`Thông tin bot yêu cầu không đúng`),
                param('groupId').exists().withMessage(`Thông tin nhóm yêu cầu không đúng`),
                body('name')
                    .exists()
                    .withMessage(`Tên của hành động không thể để trống`)
                    .isString()
                    .trim(),
            ];
        }
        case actionTypes.UPDATE_NAME_BLOCK: {
            return [
                param('botId').exists().withMessage(`Thông tin bot yêu cầu không đúng`),
                param('groupId').exists().withMessage(`Thông tin nhóm yêu cầu không đúng`),
                param('blockId').exists().withMessage(`Thông tin hành động không đúng`),
                body('name')
                    .exists()
                    .withMessage(`Tên của hành động không thể để trống`)
                    .isString()
                    .trim(),
            ];
        }
        case actionTypes.DELETE_BLOCK: {
            return [
                param('botId').exists().withMessage(`Thông tin bot yêu cầu không đúng`),
                param('groupId').exists().withMessage(`Thông tin nhóm yêu cầu không đúng`),
                param('blockId').exists().withMessage(`Thông tin hành động không đúng`),
            ];
        }
        case actionTypes.UPDATE_ELEMENTS_BLOCK: {
            return [
                param('botId').exists().withMessage(`Thông tin bot yêu cầu không đúng`),
                param('groupId').exists().withMessage(`Thông tin nhóm yêu cầu không đúng`),
                param('blockId').exists().withMessage(`Thông tin hành động không đúng`),
                body('elements')
                    .exists()
                    .withMessage('Dữ liệu của hành động không đúng'),
                body('name').exists().withMessage('Tên của hành động không thể để trống'),
            ];
        }
        case actionTypes.GET_ALL_RULE: {
            return param('botId').exists().withMessage(`Thông tin bot yêu cầu không đúng`);
        }
        case actionTypes.ADD_NEW_RULE: {
            return [
                param('botId').exists().withMessage(`Thông tin bot yêu cầu không đúng`),
                body('keyword')
                    .exists()
                    .withMessage('Bạn cần nhập Keyword cho luật'),
            ];
        }
        case actionTypes.UPDATE_RULE: {
            return [
                param('botId').exists().withMessage(`Thông tin bot yêu cầu không đúng`),
                param('ruleId').exists().withMessage(`Thông tin luật yêu cầu không đúng`),
                body('keyword')
                    .exists()
                    .withMessage('Bạn cần nhập keyword cho luật của bạn'),
                body('blocks')
                    .exists()
                    .withMessage(
                        'Bạn cần đưa ra hành động ứng với luật',
                    ),
            ];
        }
        case actionTypes.DELETE_GROUP: {
            return [
                param('botId').exists().withMessage(`Thông tin bot yêu cầu không đúng`),
                param('ruleId').exists().withMessage(`Thông tin luật yêu cầu không đúng`),
            ];
        }

        case actionTypes.CREATE_EMPTY_ELEMENT: {
            return [
                param('blockId').exists().withMessage(`Thông tin hành động không đúng`),
                body('element_type')
                    .exists()
                    .withMessage(`This type have wrong something`),
            ];
        }

        case actionTypes.DELETE_ELEMENT: {
            return [
                param('botId').exists().withMessage(`Thông tin bot yêu cầu không đúng`),
                param('groupId').exists().withMessage(`Thông tin nhóm yêu cầu không đúng`),
                param('blockId').exists().withMessage(`Thông tin hành động không đúng`),
                param('elementId').exists().withMessage(`Thông tin hành động con yêu cầu không đúng`),
            ];
        }

        case actionTypes.GET_ALL_USER: {
            return [param('botId').exists().withMessage(`Thông tin bot yêu cầu không đúng`)];
        }
        case actionTypes.SEND_MESSAGE: {
            return [param('botId').exists().withMessage(`Thông tin bot yêu cầu không đúng`)];
        }
        default: {
            return [];
        }
    }
}
/**
 * Get Error throw by fucntion validateAction
 * @param {} req
 * @param {*} res
 * @param {*} next
 */
function getValidationResult(req, res, next) {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        throw new CustomError(
            errorsCodes.BAD_REQUEST,
            errors.array().shift().msg,
        );
    }
    next();
}

module.exports = { validateAction, getValidationResult };
