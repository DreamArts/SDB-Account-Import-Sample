'use strict'

import exec from './libs/exec_importer.js'
import fs from 'fs'

fs.readFile('./config.json', async (err, config = Buffer.from('{}')) => {
    await exec(err, JSON.parse(config.toString()))
})
