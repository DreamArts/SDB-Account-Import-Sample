/* eslint-disable camelcase */
'use strict'

import axios from 'axios'

/**
 * CSV インポートされるディレクトリの定義を行う
 */
export const syncDataPostPath = '/api/v1/accountMasters'

/**
 * CSV インポートの実施
 * @param {object} config 設定情報
 * @param {string} config.accessToken システム管理トークン情報
 * @param {string} config.host 連携するためのホスト情報
 * @param {string} users_csv Base64 でエンコードしたユーザ情報 CSV
 * @param {string} groups_csv Base64 でエンコードしたグループ情報 CSV
 * @param {string} group_members_csv Base64 でエンコードした所属情報 CSV
 * @param {string} group_roles_csv Base64 でエンコードした組織ロール CSV
 * @returns {} 実行結果
 */
export default async function (config, users_csv, groups_csv, group_members_csv, group_roles_csv) {
    // ファイルがどれもなかったらエラーにする
    if (!(users_csv || groups_csv || group_members_csv || group_roles_csv)) {
        throw new Error('Not found of sync target.')
    }

    // 各種初期化処理の実施
    const { accessToken, host } = config

    const requestBody = {
        autoInvite: false,
        namespace: '*'
    }

    // 各種 CSV ファイルの連携有無の定義
    if (users_csv) requestBody.users_csv_file = `data:text/csv;base64,${users_csv}`

    if (groups_csv) requestBody.groups_csv_file = `data:text/csv;base64,${groups_csv}`

    if (group_members_csv) requestBody.group_members_csv_file = `data:text/csv;base64,${group_members_csv}`

    if (group_roles_csv) requestBody.group_roles_csv_file = `data:text/csv;base64,${group_roles_csv}`

    // リクエスト URL の生成実施
    const requestUrl = `${host.replace(/\/$/, '')}${syncDataPostPath}`

    // POST 実施
    try {
        await axios.post(
            requestUrl,
            requestBody,
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        return null
    } catch (error) {
        throw new Error(error)
    }
}
