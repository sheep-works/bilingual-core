import { useResponseMessage } from '../util/util'
import { docxReader } from './docxReader'
import { xlsxReader } from './xlsxReader'
import { pptxReader } from './pptxReader'
// import { pdfReader } from '../../old/pdfRead/pdfRead'

export async function officeBuffer2Extract(datum: ReadData, opt: ReadingOption): Promise<OfficeContent> {
  return new Promise(async (resolve, reject) => {
    if (datum.name.endsWith('.docx') || datum.name.endsWith('.docm')) {
      resolve(await docxReader(datum.data, datum.name, opt))
    }
    else if (datum.name.endsWith('.xlsx') || datum.name.endsWith('.xlsm')) {
      resolve(await xlsxReader(datum.data, datum.name, opt))
    }
    else if (datum.name.endsWith('.pptx') || datum.name.endsWith('.pptm')) {
      resolve(await pptxReader(datum.data, datum.name, opt))
    }
    // else if (datum.name.endsWith('.pdf')) {
    //   if (typeof (datum.data) !== 'string') {
    //     resolve(await pdfReader(datum.data, datum.name, opt))
    //   }
    //   else {
    //     reject()
    //   }
    // }
    // else {
    //   reject()
    // }
  })
}

export async function batchOfficeBuffer2Extract(data: ReadData[], opt: ReadingOption): Promise<OfficeContent[]> {
  return new Promise(async (resolve, reject) => {
    const prs: Promise<OfficeContent>[] = []
    for (const datum of data) {
      prs.push(officeBuffer2Extract(datum, opt))
    }
    Promise.all(prs)
      .then(result => {
        resolve(result)
      })
      .catch(() => {
        reject()
      })
  })
}

export async function officeExtract(srcFiles: ReadData[], tgtFiles: ReadData[], opt: ReadingOption): Promise<OfficeResult> {
  return new Promise(async (resolve, reject) => {
    try {
      const srcs = await batchOfficeBuffer2Extract(srcFiles, opt)
      const tgts = await batchOfficeBuffer2Extract(tgtFiles, opt)
      resolve({srcs, tgts})  
    } catch (e) {
      reject(e)
    }   
  })
}