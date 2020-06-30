const createDefaultBlock = (groupId) => {
    return [
        {
            name: 'Xin chào mặc định',
            group_id: groupId,
        },
        {
            name: 'Lỗi mặc định ',
            group_id: groupId,
        },
    ];
};

module.exports = { createDefaultBlock };
