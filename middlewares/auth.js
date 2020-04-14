/**
 * Author: ChungBT
 * Check access token in request header
 */

const asyncMiddleware = require('./async');
const CustomError = require('../common/CustomError');
const errorCodes = require('../constants/errors');
const authService = require('../services/auth');

async function auth(req, res, next) {
    const { authorization } = req.headers;
    if (!authorization) throw new CustomError(errorCodes.UNAUTHORIZED);

    const [tokenType, accessToken] = authorization.split(' ');

    if (tokenType !== 'Bearer') throw new Error(errorCodes.UNAUTHORIZED);

    const dataDecoded = await authService.verifyAccessToken(accessToken);

    // In dataDecoded have Account
    // const { account } = dataDecoded
    req.data = { dataDecoded, accessToken };

    return next();
}

module.exports = asyncMiddleware(auth);
