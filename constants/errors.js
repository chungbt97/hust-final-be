/**
 * Author: ChungBT
 * Error codes
 */
module.exports = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    ACCOUNT_NOT_EXISTS: 1001,
    ACCOUNT_EXISTS: 1002,
    VERIFY_GTOKEN_FAIL: 1003,
    BOT_NOT_EXISTS: 1004,
    APP_NOT_EXISTS: 1005,
    ACCOUNT_ASSIGNED_APP: 1006,
    ACCOUNT_NOT_ASSIGNED_BOT: 1007,
    ACCOUNT_NOT_ASSIGNED_APP: 1008,
    ZALO_USER_NOT_EXISTS: 1009,
    OVER_REQUEST_PER_MINUTE: -32,
    PARAMETER_NOT_VALID: -201,
    OA_DELETED: -204,
    OA_NOT_EXISTS: -205,
    APP_INVALID: -215,
    ACCESS_TOKEN_INVALID: -216
  };