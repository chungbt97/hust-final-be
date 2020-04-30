const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const asyncMiddleware = require('../middlewares/async');
const { validateAction, getValidationResult } = require('../common/validation');
const groupController = require('../controllers/GroupController');
const blockController = require('../controllers/BlockController');
const actionTypes = require('../constants/action');

router.get(
    '/:botId/group',
    auth,
    validateAction(actionTypes.GET_ALL_GROUP),
    getValidationResult,
    asyncMiddleware(groupController.getGroup),
);

router.post(
    '/:botId/group',
    auth,
    validateAction(actionTypes.ADD_NEW_GROUP),
    getValidationResult,
    asyncMiddleware(groupController.addGroup),
);

router.put(
    '/:botId/group/:groupId',
    auth,
    validateAction(actionTypes.UPDATE_GROUP),
    getValidationResult,
    asyncMiddleware(groupController.updateGroup),
);

router.delete(
    '/:botId/group/:groupId',
    auth,
    validateAction(actionTypes.DELETE_BOT),
    getValidationResult,
    asyncMiddleware(groupController.deleteGroup),
);

module.exports = router;
