// This module needs to be run in client side

import { readFileSync } from 'fs'
import { useResponseMessage } from '../util/util'

export async function createExecuteDatas(eopt: ExecuteOption): Promise<ExecutingData> {
  return new Promise(async (resolve, reject) => {
    try {
      const srcFiles = await path2Buffer(eopt.srcs)
      const tgtFiles = await path2Buffer(eopt.tgts)
      resolve({...eopt, srcFiles, tgtFiles})
    }
    catch {
      reject(useResponseMessage({}))
    }
  })
}


export async function path2Buffer(paths: string[]): Promise<ReadData[]> {
  return new Promise((resolve, reject) => {
    const results: ReadData[] = []
    for (const path of paths) {
      try {
        results.push({
          name: path,
          data: readFileSync(path)
        })
      }
      catch {
        reject()
      }
    }
    resolve(results)
  })
}