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
    '/:userId',
    //auth,
    validateAction(actionTypes.GET_ALL_BOT),
    getValidationResult,
    asyncMiddleware(botController.getAllBot)
);

router.post(
    '/:userId',
    //auth,
    validateAction(actionTypes.ADD_NEW_BOT),
    getValidationResult,
    asyncMiddleware(botController.addNewBot)
);

router.put(
    '/:userId',
    //auth,
    validateAction(actionTypes.UPDATE_BOT),
    getValidationResult,
    asyncMiddleware(botController.updateBot)
);

router.delete(
    '/:userId',
    //auth,
    validateAction(actionTypes.DELETE_BOT),
    getValidationResult,
    asyncMiddleware(botController.deleteBot)
);


module.exports = router;
