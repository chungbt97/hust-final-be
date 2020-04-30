/**
 * Author: ChungBT
 * Handle Error
 */
const snakecaseKeys = require('snakecase-keys');
const errorCodes = require('../constants/errors');
const logger = require('./logger');

/**
 * handle error be throwed
 * @param {Error} err
 * @param {Request} req
 * @param {Response} res
 * @param {Next} next
 */
function errorHandler(err, req, res, next) {
    let statusCode = err.code;
    let { message } = err;
    logger.error(err);
    console.log(err);
    const code = err.code || errorCodes.INTERNAL_SERVER_ERROR;
    switch (code) {
        case errorCodes.BAD_REQUEST:
            message = message || 'Bad Request';
            break;
        case errorCodes.UNAUTHORIZED:
            message = 'Unauthorized';
            break;
        case errorCodes.FORBIDDEN:
            message = 'Forbidden';
            break;
        case errorCodes.NOT_FOUND:
            message = 'Not Found';
            break;
        case errorCodes.TOO_MANY_REQUESTS:
            message = 'Too many requests';
            break;
        case errorCodes.INTERNAL_SERVER_ERROR:
            message = message || 'Something in server went wrong';
            statusCode = 200;
            break;
        case errorCodes.ACCOUNT_EXISTS:
            message = message || 'Email exists!';
            statusCode = 400;
            break;
        case errorCodes.ACCOUNT_NOT_EXISTS:
            message = message || 'Email is not exists!';
            statusCode = 400;
            break;
        default:
            message = message || 'Something went wrong';
            statusCode = 200;
    }
    return res.send({ message, status: statusCode });
}

module.exports = errorHandler;
