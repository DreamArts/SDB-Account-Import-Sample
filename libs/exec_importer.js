'use strict'

import { errorLog, warnLog } from './utils.js'

import { allowedTargetCSVFileName } from './defn.js'
import csvToBase64 from './csv.js'
import listDirectoryFiles from './listDirectoryFiles.js'
import path from 'path'
import requester from './request_import.js'
import syncWaiter from './sync_waiter.js'
import validateConfig from './validateConfig.js'

/**
 * コマンドを実行する
 * @param {Error} err エラーオブジェクト
 * @param {object} config 設定内容
 * @returns {undefined} 特になし（ console での表示のみ）
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

    const readCSVFileList = []
    const foundCSVFileList = await listDirectoryFiles(`${process.cwd()}/data/`)

    allowedTargetCSVFileName.forEach((v) => {
        if (foundCSVFileList.includes(v)) readCSVFileList.push(v)
    })

    if (!foundCSVFileList.length) {
        warnLog('Not found of sync CSV file list')
        return null
    }

    const syncCSVOfBase64 = {}

    for (const item of foundCSVFileList) {
        syncCSVOfBase64[`${item.replace('.', '_')}`] = await csvToBase64(
            path.join(process.cwd(), 'data', item)
        )
    }

    await requester(
        config,
        syncCSVOfBase64.users_csv,
        syncCSVOfBase64.groups_csv,
        syncCSVOfBase64.group_members_csv,
        syncCSVOfBase64.group_roles_csv
    )

    const syncResult = await syncWaiter(config)

    if (syncResult) {
        console.log('SUCCESS: Sync of csv files')
    } else {
        warnLog('Sync error, please check your SmartDB\'s admin page.')
    }
}
