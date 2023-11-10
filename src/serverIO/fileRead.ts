import { readFileSync } from "fs"

function fileToReadData(fileName: string): ReadData {
    const data = readFileSync(fileName)
    return {
        name: fileName,
        data
    }
}

function batchFileToReadData(fileNames: string[]): ReadData[] {
    const dataset: ReadData[] = []
    fileNames.forEach(file => {
        dataset.push(fileToReadData(file))
    })
    return dataset
}

export function makeExcecutableOption(exopt: ExecuteOption): ExecutableOption {
    const exec: ExecutableOption = {
        ...exopt,
        srcFiles: batchFileToReadData(exopt.srcs),
        tgtFiles: batchFileToReadData(exopt.tgts),
        isExecutable: false
    }
    return exec
}