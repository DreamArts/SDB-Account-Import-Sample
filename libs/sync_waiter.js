'use strict'

import axios from 'axios'

/**
 * ステータスを取得するための API の Path を定義
 */
export const statusGetPath = '/api/v1/accountMasters'

/**
 * 一定期間 wait を入れる（ 30 秒待機）
 * @returns 特になし
 */
export const waiter = async function () {
    return await new Promise(resolve => setTimeout(resolve, (30 * 1000)))
}

/**
 * 定期的に取得を行う
 * @param {object} config 設定情報
 * @returns {boolean} true: 問題なし false 問題あり
 */
export default async function (config) {
    // 初期バリデーション
    if (!config) {
        throw new Error('Not found of config information')
    }

    // 各種初期化処理の実施
    const { accessToken, host } = config

    // リクエスト URL の生成実施
    const requestUrl = `${host.replace(/\/$/, '')}${statusGetPath}`

    // リクエストの実行
    try {
        let result = {}
        const options = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            }
        }

        // status が done （完了）になるまで待機
        do {
            // 2回目以降は 30 秒待機する（ result の中身が入ることを利用
            if (Object.keys(result).length) {
                console.log('Wait 30 sec')
                await waiter()
            }
            const response = await axios.get(
                requestUrl, options
            )
            result = response.data
        } while (result.status !== 'done')

        if ('errors' in result && !result.errors) result.errors = []

        // 念の為リクエスト内部にあるかどうかの検証
        return !('errors' in result && result.errors.length)
    } catch (error) {
        throw new Error(error)
    }
}
