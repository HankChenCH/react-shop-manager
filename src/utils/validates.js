
export function confirmPassword (password, confirmPassword, callback) {
    if (confirmPassword !== password) {
        callback('两次密码必须一致')
    }

    // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
    callback()
}