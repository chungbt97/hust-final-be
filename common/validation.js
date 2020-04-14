/**
 * Author: ChungBT
 * Validator request
 */

const { body, validationResult, param, query } = require('express-validator');
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
        case actionTypes.GET_ALL_BOT: {
            return param('userId').exists().withMessage('User is not defined');
        }
        case actionTypes.ADD_NEW_BOT: {
            return param('userId').exists().withMessage('User is not defined');
        }
        case actionTypes.UPDATE_BOT: {
            return [
                param('userId').exists().withMessage('User is not defined'),
                body('id')
                    .exists()
                    .withMessage(`Bot is invalid`)
                    .isString()
                    .trim(),
            ];
        }
        case actionTypes.DELETE_BOT: {
            return [
                param('userId').exists().withMessage('User is not defined'),
                query('botId').exists().withMessage('Bot id is invalid'),
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
