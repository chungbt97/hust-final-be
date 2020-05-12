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
                    .withMessage('Invalid email')
                    .isString()
                    .trim(),
                body('password')
                    .exists()
                    .withMessage(`${fieldName.PASSWORD} is required`)
                    .isString()
                    .trim(),
            ];
        }
        case actionTypes.SIGN_UP: {
            return [
                body('firstName')
                    .exists()
                    .withMessage(`${fieldName.FIRST_NAME} is required`)
                    .isString()
                    .trim(),
                body('lastName')
                    .exists()
                    .withMessage(`${fieldName.LAST_NAME} is required`)
                    .isString()
                    .trim(),
                body('userEmail')
                    .exists()
                    .withMessage(`${fieldName.Email} is required`)
                    .isEmail()
                    .withMessage('Invalid email')
                    .isString()
                    .trim(),
                body('password')
                    .exists()
                    .withMessage(`${fieldName.PASSWORD} is required`)
                    .isString()
                    .trim(),
            ];
        }
        case actionTypes.ADD_NEW_BOT: {
            return [
                body('name')
                    .exists()
                    .withMessage(`Bot name is required`)
                    .isString()
                    .trim(),
                body('tokenApp')
                    .exists()
                    .withMessage(`AccessToken is required`)
                    .isString()
                    .trim(),
            ];
        }
        case actionTypes.UPDATE_BOT: {
            return [
                param('botId').exists().withMessage(`Bot is invalid`),
                body('name')
                    .exists()
                    .withMessage(`Bot name is required`)
                    .isString()
                    .trim(),
                body('tokenApp')
                    .exists()
                    .withMessage(`AccessToken is required`)
                    .isString()
                    .trim(),
            ];
        }
        case actionTypes.DELETE_BOT: {
            return param('botId').exists().withMessage('Bot id is invalid');
        }
        case actionTypes.GET_ALL_GROUP: {
            return param('botId').exists().withMessage(`Bot is invalid`);
        }
        case actionTypes.ADD_NEW_GROUP: {
            return [
                param('botId').exists().withMessage(`Bot is invalid`),
                body('name')
                    .exists()
                    .withMessage(`Name's group is invalid `)
                    .isString()
                    .trim(),
            ];
        }
        case actionTypes.UPDATE_GROUP: {
            return [
                param('botId').exists().withMessage(`Bot is invalid`),
                param('groupId').exists().withMessage(`Group is invalid`),
                body('name')
                    .exists()
                    .withMessage(`Name's group is invalid `)
                    .isString()
                    .trim(),
            ];
        }
        case actionTypes.DELETE_GROUP: {
            return [
                param('botId').exists().withMessage(`Bot is invalid`),
                param('groupId').exists().withMessage(`Group is invalid`),
            ];
        }
        case actionTypes.GET_CONTENT_BLOCK: {
            return [
                param('botId').exists().withMessage(`Bot is invalid`),
                param('groupId').exists().withMessage(`Group is invalid`),
                param('blockId').exists().withMessage(`Block is invalid`),
            ];
        }
        case actionTypes.ADD_NEW_BLOCK: {
            return [
                param('botId').exists().withMessage(`Bot is invalid`),
                param('groupId').exists().withMessage(`Group is invalid`),
                body('name')
                    .exists()
                    .withMessage(`Name of Block is required`)
                    .isString()
                    .trim(),
            ];
        }
        case actionTypes.TRANSFER_BLOCK: {
            return [
                param('botId').exists().withMessage(`Bot is invalid`),
                param('groupId').exists().withMessage(`Group is invalid`),
                param('blockId').exists().withMessage(`Block is invalid`),
                body('toGroupId')
                    .exists()
                    .withMessage(`Destination - group is required`),
            ];
        }
        case actionTypes.UPDATE_NAME_BLOCK: {
            return [
                param('botId').exists().withMessage(`Bot is invalid`),
                param('groupId').exists().withMessage(`Group is invalid`),
                param('blockId').exists().withMessage(`Block is invalid`),
                body('name')
                    .exists()
                    .withMessage(`Name of Block is required`)
                    .isString()
                    .trim(),
            ];
        }
        case actionTypes.DELETE_BLOCK: {
            return [
                param('botId').exists().withMessage(`Bot is invalid`),
                param('groupId').exists().withMessage(`Group is invalid`),
                param('blockId').exists().withMessage(`Block is invalid`),
            ];
        }
        case actionTypes.UPDATE_ELEMENTS_BLOCK: {
            return [
                param('botId').exists().withMessage(`Bot is invalid`),
                param('groupId').exists().withMessage(`Group is invalid`),
                param('blockId').exists().withMessage(`Block is invalid`),
                body('elements')
                    .exists()
                    .withMessage('Data of block is required'),
                body('name').exists().withMessage('Name of block is required'),
            ];
        }
        case actionTypes.GET_ALL_RULE: {
            return param('botId').exists().withMessage(`Bot is invalid`);
        }
        case actionTypes.ADD_NEW_RULE: {
            return [
                param('botId').exists().withMessage(`Bot is invalid`),
                body('keyword')
                    .exists()
                    .withMessage('Data of rule is required - keyword'),
                // body('blocks')
                //     .exists()
                //     .withMessage(
                //         'Data of rule is required - list blocks answer',
                //     ),
            ];
        }
        case actionTypes.UPDATE_RULE: {
            return [
                param('botId').exists().withMessage(`Bot is invalid`),
                param('ruleId').exists().withMessage(`Rule is invalid`),
                body('keyword')
                    .exists()
                    .withMessage('Data of rule is required - keyword'),
                body('blocks')
                    .exists()
                    .withMessage(
                        'Data of rule is required - list blocks answer',
                    ),
            
            ];
        }
        case actionTypes.DELETE_GROUP: {
            return [
                param('botId').exists().withMessage(`Bot is invalid`),
                param('ruleId').exists().withMessage(`Rule is invalid`),
            ];
        }

        case actionTypes.CREATE_EMPTY_ELEMENT: {
            return [
                param('blockId').exists().withMessage(`Block is invalid`),
                body('element_type')
                    .exists()
                    .withMessage(`This type have wrong something`),
            ];
        }

        case actionTypes.DELETE_ELEMENT: {
            return [
                param('botId').exists().withMessage(`Bot is invalid`),
                param('groupId').exists().withMessage(`Group is invalid`),
                param('blockId').exists().withMessage(`Block is invalid`),
                param('elementId').exists().withMessage(`Element is invalid`),
            ];
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
