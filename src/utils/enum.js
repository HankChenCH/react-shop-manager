const EnumTipsType = {
    SUCCESS: 'success',
    ERROR: 'error',
}

const EnumOrderStatus = {
    CLOSED: '-1',
    UNPAY: '1',
    UNDELIVERY: '2',
    DELIVERY: '3',
}

const EnumAdminStatus = {
    LOGOUT: '-1',
    LOCKED: '0',
    LOGIN: '1',
}

module.exports = {
    EnumTipsType,
    EnumOrderStatus,
    EnumAdminStatus,
}