declare interface PresetOptions {
    description: string
    mode: import("../util/params").ModeCombinations
    console: boolean
    outputFile: string
    sourceFiles: string | string[]
    targetFiles: string | string[]
    common?: CommonOption
    office?: {
        word: WordOption
        excel: ExcelOption
        ppt: PptOption
    }
    cat?: CatOption
    wwc?: WWCRate
    debug: boolean
}