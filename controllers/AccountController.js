/**
 * Author: ChungBT
 * Controller handle request to Account
 */

const validator = require('../common/validation');
const fieldName = require('../constants/fieldname');
const accountService = require('../services/account');

const signUpAccount = async (req, res) => {
    let { firstName, lastName, userEmail, password } = req.body;
    const newAccount = await accountService.signUp({
        firstName,
        lastName,
        userEmail,
        password,
    });
    return res.send({ status: 201, message: 'Created', data: newAccount });
};

const loginAccount = async (req, res) => {
    let { userEmail, password } = req.body;
    const { accessToken, acc } = await accountService.loginAccount({
        userEmail,
        password,
    });

    return res.send({
        status: 200,
        message: 'Ok',
        access_token: accessToken,
        account: acc,
    });
};


module.exports = { signUpAccount, loginAccount };
