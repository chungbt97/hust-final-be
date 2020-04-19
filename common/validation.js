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
                body('title')
                    .exists()
                    .withMessage(`Bot name is required`)
                    .isString()
                    .trim(),
            ];
        }
        case actionTypes.UPDATE_BOT: {
            return body('title')
                .exists()
                .withMessage(`Bot name is required`)
                .isString()
                .trim();
        }
        case actionTypes.DELETE_BOT: {
            return body('botId').exists().withMessage('Bot id is invalid');
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
            errors.array().shift().msg
        );
    }
    next();
}

module.exports = { validateAction, getValidationResult };
