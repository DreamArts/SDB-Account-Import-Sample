'use strict'

import { addBOMforBuffer, errorLog } from './utils.js'
import path, { join } from 'path'

import exporter from './request_export.js'
import validateConfig from './validateConfig.js'
import { writeFile } from 'fs/promises'

const exportTargetDir = '/export/'

/**
 * コマンドを実行をする
 * @param {Error} err エラーインスタンス
 * @param {object} config 設定情報
 */
export default async function (err, config) {
    if (err) {
        if ('message' in err && err.message.match(/ENOENT/)) {
            errorLog('not found config.json')
            return
        } else throw err
    }

    const validateRes = validateConfig(config)
    if (!validateRes) return

    const csvData = await exporter(config)

    for (const item in csvData) {
        await writeFile(
            path.join(process.cwd(), exportTargetDir, item.replace(/_csv$/, '.csv')),
            addBOMforBuffer(Buffer.from(csvData[item]))
        )
    }

    console.log(`SUCCESS: Exported CSV Files, exported dir is ${join(
        process.cwd(), exportTargetDir
    )}`)
}
