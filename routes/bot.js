/**
 * Author: ChungBT
 * Route .../bot/
 */
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const asyncMiddleware = require('../middlewares/async');
const { validateAction, getValidationResult } = require('../common/validation');
const botController = require('../controllers/BotController');
const actionTypes = require('../constants/action');

/* GET all chatbot */
router.get(
    '/',
    auth,
    validateAction(actionTypes.GET_ALL_BOT),
    getValidationResult,
    asyncMiddleware(botController.getAllBot)
);
router.get(
    '/:botId',
    auth,
    validateAction(actionTypes.GET_DATA_BOT),
    getValidationResult,
    asyncMiddleware(botController.getDataOfBot)
);

router.delete(
    '/:botId',
    auth,
    validateAction(actionTypes.DELETE_BOT),
    getValidationResult,
    asyncMiddleware(botController.deleteBot)
);

module.exports = router;
