const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const asyncMiddleware = require('../middlewares/async');
const { validateAction, getValidationResult } = require('../common/validation');
const ruleController = require('../controllers/RuleController');

const actionTypes = require('../constants/action');

router.get(
    '/:botId/rule',
    auth,
    validateAction(actionTypes.GET_ALL_RULE),
    getValidationResult,
    asyncMiddleware(ruleController.getRule),
);

router.post(
    '/:botId/rule',
    auth,
    validateAction(actionTypes.ADD_NEW_RULE),
    getValidationResult,
    asyncMiddleware(ruleController.addRule),
);

router.put(
    '/:botId/rule/:ruleId',
    auth,
    validateAction(actionTypes.UPDATE_RULE),
    getValidationResult,
    asyncMiddleware(ruleController.updateRule),
);

router.delete(
    '/:botId/rule/:ruleId',
    auth,
    validateAction(actionTypes.DELETE_RULE),
    getValidationResult,
    asyncMiddleware(ruleController.deleteRule),
);

module.exports = router;