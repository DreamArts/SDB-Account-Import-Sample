'use strict'

/**
 * リクエストを出すために必要な URL を生成する
 * @param {string} host プロトコルおよびホストの情報が含まれる文字列
 * @param {string} path 結合したいパス文字列（ / から始まる）
 * @returns {string} 結合された URL 文字列
 */
export const generateRequestUrl = function (host, path) {
    if (!path) path = '/'
    return `${host.replace(/\/$/, '')}${path}`
}

/**
 * UTF-8 の BOM を付与する
 * @param {Buffer} buf BOM を追加する
 * @returns {Buffer} BOM 付きのバッファ
 */
export const addBOMforBuffer = function (buf) {
    if (!buf) return Buffer.alloc(0)
    else if (!Buffer.isBuffer(buf)) throw new Error('not buffer')
    else if (buf.toString('utf-8').match('\ufeff')) return buf
    return Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), Buffer.from(buf)])
}

/**
 * エラーレベルのログを出力する
 * @param {string} msg 出力したい内容
 */
export const errorLog = function (msg) {
    console.log('\x1b[31m', 'ERROR: ', msg, '\x1b[0m')
}

/**
 * 警告レベルのログを出力する
 * @param {string} msg 出力したい内容
 */
export const warnLog = function (msg) {
    console.log('\x1b[33m', 'WARN: ', msg, '\x1b[0m')
}
