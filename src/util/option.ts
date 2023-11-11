export function createCommonOption(common?: Partial<CommonOption>): CommonOption {
  const opt: CommonOption = {
    // name: common !== undefined ? common.name || 'Result' : 'Result',
    segmentation: common !== undefined
      ? common.segmentation !== undefined
        ? common.segmentation : true
      : true,
    delimiters: common !== undefined
      ? common.delimiters || '(。|！|？|(\\. )|(\\! )|(\\? ))' : '(。|！|？|(\\. )|(\\! )|(\\? ))',
    excluding: common !== undefined
      ? common.excluding !== undefined
        ? common.excluding : false
      : false,
    excludePattern: common !== undefined
      ? common.excludePattern || '^[０-９0-9]+$' : '^[０-９0-9]+$',
    withSeparator: common !== undefined
      ? common.withSeparator !== undefined
        ? common.withSeparator : true
      : true,
  }
  return opt
}

export function createOfficeOption(office?: Partial<OfficeOption>): OfficeOption {
  const opt: OfficeOption = {
    word: {
      afterRev: office !== undefined
        ? office.word?.afterRev !== undefined
          ? office.word.afterRev : true
        : true,
      afterRev2: office !== undefined
        ? office.word?.afterRev !== undefined
          ? office.word?.afterRev : true
        : true
    },
    excel: {
      readFilledCell: office !== undefined
        ? office.excel?.readFilledCell !== undefined
          ? office.excel?.readFilledCell : true
        : true,
      readHiddenSheet: office !== undefined ?
        office.excel?.readHiddenSheet !== undefined
          ? office.excel?.readHiddenSheet : false
        : false,
    },
    ppt: {
      readSlide: office !== undefined
        ? office.ppt?.readSlide !== undefined
          ? office.ppt?.readSlide : true
        : true,
      readNote: office !== undefined
        ? office.ppt?.readNote !== undefined
          ? office.ppt?.readNote : true
        : true,
    }
  }
  return opt
}

export function createCatOption(cat?: Partial<CatOption>): CatOption {
  const opt: CatOption = {
    locales: cat !== undefined
      ? cat.locales || 'all' : 'all',
    fullset: cat !== undefined
      ? cat.fullset !== undefined
        ? cat.fullset : false
      : false,
    overWrite: cat !== undefined
      ? cat.overWrite !== undefined
        ? cat.overWrite : false
      : false,
  }
  return opt
}

export function createWwcOption(wwc?: Partial<WWCRate>): WWCRate {
  const rate: WWCRate = {
    dupli: wwc?.dupli || 1,
    over95: wwc?.over95 || 1,
    over85: wwc?.over85 || 1,
    over75: wwc?.over75 || 1,
    over50: wwc?.over50 || 1,
    under49: wwc?.under49 || 1,
  }
  return rate
}

export function createOption(option?: ReadingOptionQue): ReadingOption {
  const opt: ReadingOption = {
    common: createCommonOption(option?.common),
    office: createOfficeOption(option?.office),
    cat: createCatOption(option?.cat),
    wwc: createWwcOption(option?.wwc)
  }
  return opt
}

export function createExecuteOptionTemplate(): ExecuteOption {
  return {
    mode1: '',
    mode2: '',
    srcs: [],
    tgts: [],
    output: '',
    debug: false,
    opt: createOption()
  }
}

export function parsePresetToExecuteOption(pre: PresetOptions): ExecuteOption {
  const [mode1, mode2] = pre.mode.split(':')
  console.log(pre.description)
  return {
    mode1,
    mode2,
    srcs: typeof pre.sourceFiles === 'string' ? [pre.sourceFiles] : pre.sourceFiles,
    tgts: typeof pre.targetFiles === 'string' ? [pre.targetFiles] : pre.targetFiles,
    output: pre.console ? 'console' : pre.outputFile,
    debug: pre.debug,
    opt: createOption(pre)
  }
}