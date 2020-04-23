/**
 * Author: ChungBT
 * Handle jwt
 */
const jwt = require('jsonwebtoken');
const CustomError = require('../common/CustomError');
const errorCodes = require('../constants/errors');
const AccountModel = require('../models/account');

const { JWT_SECRET_KEY, JWT_EXPIRES_TIME } = process.env;

/**
 * generate access token
 * @param {User id} accountId: Object id
 */
function generateAccessToken(accountId) {
    const accessToken = jwt.sign({ accountId }, JWT_SECRET_KEY, {
        expiresIn: JWT_EXPIRES_TIME,
    });
    return accessToken;
}

async function verifyAccessToken(token) {
    const data = await jwt.verify(token, JWT_SECRET_KEY);
    if (!data) throw new CustomError(errorCodes.UNAUTHORIZED);
    let { accountId } = data;
    let account = await AccountModel.findOne({
        _id: accountId,
    });
    if (!account) {
        throw new CustomError(errorCodes.UNAUTHORIZED);
    }
    return data;
}
module.exports = { generateAccessToken, verifyAccessToken };
