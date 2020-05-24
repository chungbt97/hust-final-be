const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const asyncMiddleware = require('../middlewares/async');
const { validateAction, getValidationResult } = require('../common/validation');
const actionTypes = require('../constants/action');
const userController = require('../controllers/UserController');

router.get(
    '/:botId/user',
    auth,
    validateAction(actionTypes.GET_ALL_USER),
    getValidationResult,
    asyncMiddleware(userController.getAllUsers),
);

router.post(
    '/:botId/user',
    auth,
    validateAction(actionTypes.SEND_MESSAGE),
    getValidationResult,
    asyncMiddleware(userController.sendMessageToUser),
);
module.exports = router;