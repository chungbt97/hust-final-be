/**
 * Author: ChungBT
 * Route .../bot/
 */
var express = require('express');
var router = express.Router();
var actionTypes = require('../constants/action');
var blockController = require('../controllers/BlockController');
var asyncMiddleware = require('../middlewares/async');
var { validateAction, getValidationResult } = require('../common/validation');
var auth = require('../middlewares/auth');

/* GET content of block */
router.get(
    '/:botId/group/:groupId/block/:blockId',
    auth,
    validateAction(actionTypes.GET_CONTENT_BLOCK),
    getValidationResult,
    asyncMiddleware(blockController.getContentBlock)
);

router.post(
    '/:botId/group/:groupId/block',
    auth,
    validateAction(actionTypes.ADD_NEW_BLOCK),
    getValidationResult,
    asyncMiddleware(blockController.addNewBlock)
);

router.put(
    '/:botId/group/:groupId/block/:blockId',
    auth,
    validateAction(actionTypes.UPDATE_NAME_BLOCK),
    getValidationResult,
    asyncMiddleware(blockController.updateNameBlock)
);

router.delete(
    '/:botId/group/:groupId/block/:blockId',
    auth,
    validateAction(actionTypes.DELETE_BLOCK),
    getValidationResult,
    asyncMiddleware(blockController.deleteBlock)
);

router.post(
    '/:botId/group/:groupId/block/:blockId',
    auth,
    validateAction(actionTypes.TRANSFER_BLOCK),
    getValidationResult,
    asyncMiddleware(blockController.transferBlock)
);


module.exports = router;
