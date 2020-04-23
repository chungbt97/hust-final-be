const createDefaultBlock = (groupId) => {
    return [
        {
            name: 'Wellcome Message ' + groupId,
            group_id: groupId,
        },
        {
            name: 'Error Message ' + groupId,
            group_id: groupId,
        },
    ];
};

module.exports = { createDefaultBlock };
