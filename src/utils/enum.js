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

const EnumChatStatus = {
    Online: 1,
    Offline: 0,
}

const EnumResourceType = {
    View: '1',
    Data: '2',
}

const EnumPermissionType = {
    Public: '1',
    Protected: '2',
    Private: '3',
}

const EnumChatType = {
    Member: '1',
    Group: '2',
}

module.exports = {
    EnumTipsType,
    EnumOrderStatus,
    EnumAdminStatus,
    EnumChatStatus,
    EnumResourceType,
    EnumPermissionType,
    EnumChatType,
}