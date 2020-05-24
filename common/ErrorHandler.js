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
    console.log(err.message);
    const code = err.code || errorCodes.INTERNAL_SERVER_ERROR;
    switch (code) {
        case errorCodes.BAD_REQUEST:
            message = message || 'Yêu cầu không hợp lệ';
            break;
        case errorCodes.UNAUTHORIZED:
            message = 'Truy cập không hợp lệ';
            break;
        case errorCodes.FORBIDDEN:
            message = 'Truy cập bị cấm';
            break;
        case errorCodes.NOT_FOUND:
            message = 'Không tìm thấy thông tin yêu cầu';
            break;
        case errorCodes.TOO_MANY_REQUESTS:
            message = 'Quá nhiều yêu cầu';
            break;
        case errorCodes.INTERNAL_SERVER_ERROR:
            message = message || 'Máy chủ lỗi';
            statusCode = 200;
            break;
        case errorCodes.ACCOUNT_EXISTS:
            message = message || 'Email đã tồn tại';
            statusCode = 400;
            break;
        case errorCodes.ACCOUNT_NOT_EXISTS:
            message = message || 'Email không hợp lệ';
            statusCode = 400;
            break;
        case errorCodes.OVER_REQUEST_PER_MINUTE:
            message = message || 'Vượt quá giới hạn request/phút.';
            statusCode = -32;
            break;
        case errorCodes.PARAMETER_NOT_VALID:
            message = message || 'Tham số không hợp lệ';
            statusCode = -201;
            break;
        case errorCodes.OA_DELETED:
            message = message || 'Official Account đã bị xóa';
            statusCode = -204;
            break;
        case errorCodes.OA_NOT_EXISTS:
            message = message || 'Official Account không tồn tại';
            statusCode = -205;
            break;
        case errorCodes.APP_INVALID:
            message = message || 'App id không hợp lệ';
            statusCode = -215;
            break;
        case errorCodes.ACCESS_TOKEN_INVALID:
            message = message || 'Access token không hợp lệ';
            statusCode = -216;
            break;
        default:
            message = message || 'Máy chủ quá tải';
            statusCode = 500;
    }
    return res.send({ message, status: statusCode });
}

module.exports = errorHandler;
