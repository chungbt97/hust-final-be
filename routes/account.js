/**
 * Author: ChungBT
 * Route .../account/
 */
var express = require('express');
var router = express.Router();
var actionTypes = require('../constants/action');
var accountController = require('../controllers/AccountController');
var asyncMiddleware = require('../middlewares/async');
var { validateAction, getValidationResult } = require('../common/validation');

/* GET home page. */
router.post(
    '/sign-up',
    validateAction(actionTypes.SIGN_UP),
    getValidationResult,
    asyncMiddleware(accountController.signUpAccount)
);

router.post(
    '/sign-in',
    validateAction(actionTypes.SIGN_IN),
    getValidationResult,
    asyncMiddleware(accountController.loginAccount)
);


module.exports = router;
