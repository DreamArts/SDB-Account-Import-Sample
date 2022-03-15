'use strict'

import * as fs from 'fs/promises'

import _ from 'lodash'

/**
 * CSV ファイルを読み取り、 Base64 フォーマットで出力する
 * @param {string} filePath CSV ファイルが保存されているディレクトリ
 * @returns {string}  Base64 エンコードされた文字列
 */
export default async function (filePath) {
    if (!filePath || !_.isString(filePath)) throw new Error('not input file path')
    else if (!/.csv$/.test(filePath)) throw new Error('invalid file type')
    else if (/^./.test(filePath)) filePath.replace(/^./, process.cwd())

    return (await fs.readFile(filePath)).toString('base64')
}
