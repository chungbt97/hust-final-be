const createDefaultBlock = (groupId) => {
    return [
        {
            name: 'Wellcome Message',
            group_id: groupId,
        },
        {
            name: 'Error Message',
            group_id: groupId,
        },
    ];
};

module.exports = {createDefaultBlock};
