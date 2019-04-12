/**
 *validator.js 是一个验证表单文件
 */

/**
 * 手机号码
 * @param {int} value 需要验证的值
 * @param {boolean} required 是否必填
 */
exports.tel = (value, required) => {
    if (required === true && (value === null || value === '')) {
        return '请输入手机号码'
    }
    if (!(/^1[34578]\d{9}$/.test(value))) {
        return '手机号码有误，请重填'
    }
}

/**
 * 短信
 * @param {int} value 需要验证的值
 * @param {boolean} required 是否必填
 */
exports.sms = (value, required) => {
    if (required === true && (value === null || value === '')) {
        return '请输入验证码'
    }
    if (value.length < 4) {
        return '请输入正确的验证码'
    }
}
