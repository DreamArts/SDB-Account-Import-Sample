'use strict'

import { allowedTargetCSVFileName } from './defn.js'
import axios from 'axios'
import { generateRequestUrl } from './utils.js'
import path from 'path'

export const exportSmartDBPath = '/api/v1/accountMasters/export/'

/**
 * CSV ファイルをエクスポートするために必要なキー一覧の生成
 * @returns {array} エクスポート対象となる CSV のキー名称
 */
export const exportFileList = function () {
    const result = []

    for (const item of allowedTargetCSVFileName) {
        result.push(item.replace('.csv', ''))
    }

    return result
}

/**
 * CSV エクスポートの実施
 * @param {object} config 設定情報
 * @returns {object} CSV ファイルのインスタンスが含まれるオブジェクト
 */
export default async function (config) {
    const fileList = exportFileList()
    const withInactive = 'withInactive' in config ? config.withInactive : true

    try {
        const exportFileList = {}
        for (const item of fileList) {
            exportFileList[`${item}_csv`] = (await axios.get(
                generateRequestUrl(
                    config.host,
                    path.join(exportSmartDBPath, item)
                ),
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${config.accessToken}`
                    },
                    params: {
                        withInactive: withInactive
                    }
                }
            )).data
        }
        return exportFileList
    } catch (err) {
        throw new Error(err)
    }
}
