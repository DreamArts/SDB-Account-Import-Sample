'use strict'

import { addBOMforBuffer } from './libs/utils.js'
import exec from './libs/exec_exporter.js'
import fs from 'fs'
import fsPromises from 'fs/promises'
import path from 'path'

fs.readFile('./config.json', async (err, config = Buffer.from('{}')) => {
    const res = await exec(err, JSON.parse(config.toString()))

    for (const item in res) {
        await fsPromises.writeFile(
            path.join(
                process.cwd(),
                '/export/',
                item.replace('_csv', '.csv')
            ),
            addBOMforBuffer(Buffer.from(res[item]))
        )
    }
})
