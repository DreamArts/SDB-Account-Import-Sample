'use strict'

import _ from 'lodash'
import { errorLog } from './utils.js'

/**
 * config で渡された情報が正しいものか判定を行う
 * @param {object} config 設定情報
 * @returns {null} 問題なし
 * @throws 問題がある場合はメッセージとともにエラーが返却
 */
export default function (config) {
    // 入ってきた config が正しいものか判定する
    if (!config || !_.isPlainObject(config)) {
        errorLog('Invalid type of config')
        return false
    }

    // 基本的なバリデーションの実施
    if (!(
        'host' in config &&
        'accessToken' in config &&
        _.isString(config.host) &&
        _.isString(config.accessToken) &&
        config.host.trim() &&
        config.accessToken.trim()
    )) {
        errorLog('Invalid config data, not defined host and accessToken')
        return false
    }

    // URL であるかどうか
    if (!(/^http(|s):\/\//.test(config.host))) {
        errorLog('Invalid host at config data, please check start string is https://')
        return false
    }

    return true
}
