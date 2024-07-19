// Option
declare interface CommonOption {
    segmentation: boolean;
    delimiters: string;
    excluding: boolean;
    excludePattern: string;
    withSeparator: boolean;
    countUnit: 'chara' | 'word'
}

declare interface WordOption {
    afterRev: boolean;
    afterRev2: boolean;
}

declare interface ExcelOption {
    readHiddenSheet: boolean;
    readFilledCell: boolean;
}

declare interface PptOption {
    readSlide: boolean;
    readNote: boolean;
}

declare interface CatOption {
    locales: string[] | 'all';
    fullset: boolean;
    overWrite: boolean;
}

declare interface WWCRate {
    dupli: number;
    over95: number;
    over85: number;
    over75: number;
    over50: number;
    under49: number;
}

declare interface OfficeOption {
    word: WordOption
    excel: ExcelOption
    ppt: PptOption
}

declare interface ReadingOption {
    common: CommonOption
    office: OfficeOption
    cat: CatOption
    wwc: WWCRate
}

declare interface ReadingOptionQue {
    common?: Partial<CommonOption>
    office?: Partial<OfficeOption>
    cat?: Partial<CatOption>
    wwc?: Partial<WWCRate>
}

declare interface ExecuteOption {
    mode1: string
    mode2: string
    srcs: string[]
    tgts: string[]
    output: string
    opt: ReadingOption
    debug: boolean
}

declare interface ExecutableOption extends ExecuteOption {
    srcFiles: ReadData[]
    tgtFiles: ReadData[]
    isExecutable: boolean
}