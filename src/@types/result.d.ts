declare interface OfficeResult {
    srcs: OfficeContent[]
    tgts: OfficeContent[]
}

declare interface CountResult {
    name: string
    charas: number
    words: number
}

declare interface ProceedResult {
    isSuccess: boolean
    message: string
    office?: OfficeResult
    count?: CountResult[]
    wwc?: WWCReport
    diffs?: DiffSeg[]
    result: string[]
}
