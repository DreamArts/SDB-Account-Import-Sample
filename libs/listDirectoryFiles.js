'use strict'

import * as fs from 'fs/promises'

/**
 * ディレクトリ以下に存在する CSV ファイル一覧を取得する
 * @param {string} path ディレクトリのパスを指定する
 * @returns {array} CSV ファイルの一覧
 */
export default async function (path) {
    const readdirRes = await fs.readdir(path, {
        withFileTypes: true
    })
    const fileList = []

    for (const item of readdirRes) {
        if (item.isFile() && /.csv/.test(item.name)) {
            fileList.push(item.name)
        }
    }

    return fileList
}
