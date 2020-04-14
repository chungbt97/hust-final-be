const tableName = require('../constants/table');
const getFieldUpdates = (table, data) => {
    let fieldUpdates = {
        updatedAt: new Date().now,
    };
    switch (table) {
        case tableName.BOT:
            const { userId, bot } = data;
            const { title, description, keyApp, tokenApp } = bot;
            fieldUpdates.user_id = userId;
            if (title) fieldUpdates.name = title;
            if (description) fieldUpdates.description = description;
            if (keyApp) fieldUpdates.keyApp = keyApp;
            if (tokenApp) fieldUpdates.tokenApp = tokenApp;
            return fieldUpdates;
        default:
            break;
    }
};

module.exports = { getFieldUpdates };
