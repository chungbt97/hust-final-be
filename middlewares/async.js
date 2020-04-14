/**
 * Author: ChungBT
 * bắt tất cả các lỗi được throw ra. Keyword: "Error handling express"
 */
const asyncMiddleware = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next))
    .catch(next);

module.exports = asyncMiddleware;
