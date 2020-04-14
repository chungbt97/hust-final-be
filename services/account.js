/**
 * Author: ChungBT
 * function service will handle logic
 */
const md5 = require('md5');
const AccountModel = require('../models/Account');
const CustomError = require('../common/CustomError');
const errorCodes = require('../constants/errors');
const authService = require('../services/auth');

/**
 * Service register new account
 * @param {*} account
 */
const signUp = async (account) => {
    let { firstName, lastName, userEmail, password } = account;
    // check exits email
    const acc = await AccountModel.findOne({ userEmail: userEmail });
    if (acc) throw new CustomError(errorCodes.ACCOUNT_EXISTS);

    let newAccount = await AccountModel.create(
        {
            firstName,
            lastName,
            userEmail,
            password,
            createdAt: new Date().now,
            updatedAt: new Date().now,
        }
    );
    return newAccount;
};

/**
 * login
 * @param {email} userEmail
 * @param {password} password
 */
const loginAccount = async ({ userEmail, password }) => {
    let accessToken = null;
    const acc = await AccountModel.findOne({ userEmail }).select(
        '_id, password'
    );
    if (!acc) throw new CustomError(errorCodes.ACCOUNT_NOT_EXISTS);
    if (md5(password) === acc.password) {
        accessToken = authService.generateAccessToken(acc._id);
    }
    return { accessToken, acc };
};
module.exports = { signUp, loginAccount };
