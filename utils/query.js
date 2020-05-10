const tableName = require('../constants/table');
const getFieldUpdates = (table, data) => {
    let fieldUpdates = {
        updatedAt: new Date().now,
    };
    switch (table) {
        case tableName.BOT:
            const { userId, bot } = data;
            const { name, description, appId, tokenApp } = bot;
            fieldUpdates.user_id = userId;
            if (name) fieldUpdates.name = name;
            if (description) fieldUpdates.description = description;
            if (appId) fieldUpdates.app_id = appId;
            if (tokenApp) fieldUpdates.tokenApp = tokenApp;
            return fieldUpdates;
        default:
            break;
    }
};

module.exports = { getFieldUpdates };
