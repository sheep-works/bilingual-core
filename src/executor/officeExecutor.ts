import { useResponseMessage, str2NameAndExtension } from "../util/util"
import { getOfficeContent } from "../office/officeEntry"
import { DiffCalculator } from "./diffCalc"

export function officeExecutor(exec: ExecutableOption): Promise<ProceedResult> {
    return new Promise(async (resolve, reject) => {
        const res: ProceedResult = {
            isSuccess: false,
            message: "",
            result: [],
        }
        officePreExecutor(exec)
            .then(office => {
                res.office = office
                if (res.office === undefined) {
                    const message = useResponseMessage({
                        isErr: true,
                        code: "404",
                        name: "Office Extract Failed",
                        message: "Office files are not extractable"
                    })
                    reject(message)
                }
                else {
                    const [name, ext] = str2NameAndExtension(exec.output)
                    switch (exec.mode2) {
                        case "EXTRACT":
                            resolve(officeExtract(res, ext, exec.opt))
                            break

                        case "ALIGN":
                            resolve(officeAlign(res, exec.opt))
                            break

                        case "COUNT":
                            resolve(officeCount(res, ext))
                            break

                        case "DIFF":
                            resolve(officeDiff(res, exec.opt))
                            break

                        default: {
                            const message = useResponseMessage({
                                isErr: true,
                                code: "403",
                                name: "Office Extract Failed",
                                message: "Failed to extract office files"
                            })
                            reject(message)
                            break
                        }
                    }
                }
            })
            .catch(err => {
                reject(err)
            })
    })
}


function officePreExecutor(exec: ExecutableOption): Promise<OfficeResult> {
    return new Promise(async (resolve, reject) => {
        try {
            const office = await getOfficeContent(exec.srcFiles, exec.tgtFiles, exec.opt)
            resolve(office)
        } catch {
            const message = useResponseMessage({
                isErr: true
            })
            reject(message)
        }
    })
}



function segPairing(sVal: string[], tVal: string[], mark: string, separation: boolean): string[] {
    const inSection: string[] = [];
    if (separation) {
        inSection.push(`_@λ_ ${mark} _λ@_\t_@λ_ ${mark} _λ@_`);
    }
    const sLen = sVal.length;
    const tLen = tVal.length;
    const larger = sLen >= tLen ? sLen : tLen;
    if (sLen > tLen) {
        const diff = sLen - tLen;
        for (let i = 0; i < diff; i++) {
            tVal.push('');
        }
    } else if (sLen < tLen) {
        const diff = tLen - sLen;
        for (let i = 0; i < diff; i++) {
            sVal.push('');
        }
    }
    for (let i = 0; i < larger; i++) {
        if (!(sVal[i] === '' && tVal[i] === '')) {
            inSection.push(`${sVal[i].replace(/\n|\r/g, '')}\t${tVal[i].replace(/\n|\r/g, '')}`);
        }
    }
    return inSection;
}


function officeConv2SimplifiedText(contents: OfficeContent[]): string[] {
    const results: string[] = []
    for (const file of contents) {
        const result: string[] = []
        for (const text of file.exts) {
            if (text.isActive) {
                result.push(...text.value)
            }
        }
        results.push(result.join("\n"))
    }
    return results
}

function officeConv2MarkedText(contents: OfficeContent[], opt: ReadingOption): string[] {
    const result: string[] = [];
    for (const file of contents) {
        result.push(file.name);
        for (const text of file.exts) {
            if (!text.isActive) {
                if (file.format === 'xlsx') {
                    if (!opt.office.excel.readHiddenSheet) {
                        continue
                    }
                } else {
                    continue;
                }
            }
            let mark = '';
            switch (text.type) {
                case 'Word-Paragraph':
                    mark = '_@λ_ PARAGRAPH _λ@_';
                    break;

                case 'Word-Table':
                    mark = '_@λ_ TABLE _λ@_';
                    break;

                case 'Excel-Sheet':
                    mark = `_@λ_ SHEET${text.position} _λ@_`;
                    break;

                case 'Excel-Shape':
                    mark = `_@λ_ SHEET${text.position} shape _λ@_`;
                    break;

                case 'PPT-Slide':
                    mark = `_@λ_ SLIDE${text.position} _λ@_`;
                    break;

                case 'PPT-Diagram':
                    mark = `_@λ_ SLIDE${text.position} diagram _λ@_`;
                    break;

                case 'PPT-Chart':
                    mark = `_@λ_ SLIDE${text.position} chart _λ@_`;
                    break;

                case 'PPT-Note':
                    mark = `_@λ_ SLIDE${text.position} note _λ@_`;
                    break;

                default:
                    break;
            }
            result.push(mark);
            result.push(...text.value);
        }
    }
    return result
}

function wordContentsConv2AlignedText(src: OfficeContent, tgt: OfficeContent, opt: ReadingOption): string[] {
    const inFile: string[] = []
    if (opt.common.withSeparator) {
        inFile.push(`_@@_ ${src.name}\t_@@_ ${tgt.name}`);
    }
    const spfs: ExtractedText[] = [];
    const stfs: ExtractedText[] = [];
    for (const et of src.exts) {
        if (et.type === 'Word-Paragraph') {
            spfs.push(et);
        } else if (et.type === 'Word-Table') {
            stfs.push(et);
        }
    }

    const tpfs: ExtractedText[] = [];
    const ttfs: ExtractedText[] = [];
    for (const et of tgt.exts) {
        if (et.type === 'Word-Paragraph') {
            tpfs.push(et);
        } else if (et.type === 'Word-Table') {
            ttfs.push(et);
        }
    }

    const spfNum = spfs.length;
    const tpfNum = tpfs.length;
    const plarger = spfNum >= tpfNum ? spfNum : tpfNum;
    for (let j = 0; j < plarger; j++) {
        const sv = spfs[j] !== undefined ? spfs[j].value.slice() : [''];
        const tv = tpfs[j] !== undefined ? tpfs[j].value.slice() : [''];
        inFile.push(...segPairing(sv, tv, 'PARAGRAPH', opt.common.withSeparator));
    }

    const stfNum = stfs.length;
    const ttfNum = ttfs.length;
    const tlarger = stfNum >= ttfNum ? stfNum : ttfNum;
    for (let k = 0; k < tlarger; k++) {
        const sv = stfs[k] !== undefined ? stfs[k].value.slice() : [''];
        const tv = ttfs[k] !== undefined ? ttfs[k].value.slice() : [''];
        inFile.push(...segPairing(sv, tv, 'TABLE', opt.common.withSeparator));
    }
    inFile.push('_@@_ EOF\t_@@_ EOF');
    return inFile
}

function excelContentsConv2AlignedText(src: OfficeContent, tgt: OfficeContent, opt: ReadingOption): string[] {
    const inFile: string[] = []
    if (opt.common.withSeparator) {
        inFile.push(`_@@_ ${src.name}\t_@@_ ${tgt.name}`);
    }
    const sfNum = src.exts.length;
    const tfNum = tgt.exts.length;
    const larger = sfNum >= tfNum ? sfNum : tfNum;
    let k = 0;
    for (let j = 0; j <= larger - 1; j++) {
        k++;
        const sv = src.exts[j] !== undefined ? src.exts[j].value.slice() : [''];
        const tv = tgt.exts[j] !== undefined ? tgt.exts[j].value.slice() : [''];
        inFile.push(...segPairing(sv, tv, `SHEET${k}`, opt.common.withSeparator));
        if (src.exts[j + 1] !== undefined && tgt.exts[j + 1] !== undefined) {
            if (src.exts[j + 1].type === 'Excel-Shape' || tgt.exts[j + 1].type === 'Excel-Shape') {
                const sv = src.exts[j + 1].type === 'Excel-Shape' ? src.exts[j + 1].value.slice() : [''];
                const tv = tgt.exts[j + 1].type === 'Excel-Shape' ? tgt.exts[j + 1].value.slice() : [''];
                inFile.push(...segPairing(sv, tv, `SHEET${k}-shape`, opt.common.withSeparator));
                j++;
            }
        }
    }
    inFile.push('_@@_ EOF\t_@@_ EOF');
    return inFile
}

function pptContentsConv2AlignedText(src: OfficeContent, tgt: OfficeContent, opt: ReadingOption): string[] {
    const inFile: string[] = []
    if (opt.common.withSeparator) {
        inFile.push(`_@@_ ${src.name}\t_@@_ ${tgt.name}`);
    }
    const sfNum = src.exts.length;
    const tfNum = tgt.exts.length;
    const larger = sfNum >= tfNum ? sfNum : tfNum;
    let k = 0;
    for (let j = 0; j <= larger - 1; j++) {
        k++;
        const sv = src.exts[j] !== undefined ? src.exts[j].value.slice() : [''];
        const tv = tgt.exts[j] !== undefined ? tgt.exts[j].value.slice() : [''];
        inFile.push(...segPairing(sv, tv, `SLIDE${k}`, opt.common.withSeparator));
        if (src.exts[j + 1] !== undefined && tgt.exts[j + 1] !== undefined) {
            if (src.exts[j + 1].type === 'PPT-Note' || tgt.exts[j + 1].type === 'PPT-Note') {
                const sv = src.exts[j + 1].type === 'PPT-Note' ? src.exts[j + 1].value.slice() : [''];
                const tv = tgt.exts[j + 1].type === 'PPT-Note' ? tgt.exts[j + 1].value.slice() : [''];
                inFile.push(...segPairing(sv, tv, `SLIDE${k}-note`, opt.common.withSeparator));
                j++;
            }
        }
    }
    inFile.push('_@@_ EOF\t_@@_ EOF')
    return inFile
}


function officeConv2AlignedText(srcs: OfficeContent[], tgts: OfficeContent[], opt: ReadingOption): string[] {
    const aligned: string[] = [];
    srcs.forEach((src, i) => {
        const type = src.format;
        switch (type) {
            case 'docx':
                aligned.push(...wordContentsConv2AlignedText(src, tgts[i], opt));
                break;

            case 'xlsx':
                aligned.push(...excelContentsConv2AlignedText(src, tgts[i], opt));
                break;

            case 'pptx':
                aligned.push(...pptContentsConv2AlignedText(src, tgts[i], opt));
                break;

            default:
                break;
        }
    })
    return aligned;
}

export function officeExtract(res: ProceedResult, ext: string, opt: ReadingOption): ProceedResult {
    switch (ext) {
        case "":
        case "console":
        case "txt":
            return officeExtractTxt(res, opt)

        case "json":
            return officeExtractJson(res)

        default:
            return res
    }
}

function officeExtractTxt(res: ProceedResult, opt: ReadingOption): ProceedResult {
    if (res.office === undefined) {
        return res
    }
    const texts = opt.common.withSeparator
        ? officeConv2MarkedText(res.office.srcs, opt) : officeConv2SimplifiedText(res.office.srcs)
    res.result = [...texts]
    res.isSuccess = true
    return res
}

function officeExtractJson(res: ProceedResult): ProceedResult {
    if (res.office === undefined) {
        return res
    }
    const data = {
        srcs: res.office.srcs,
        tgts: res.office.tgts
    }
    res.result.push(JSON.stringify(data, null, 2))
    return res
}

export function officeAlign(res: ProceedResult, opt: ReadingOption): ProceedResult {
    if (res.office === undefined) {
        return res
    }
    res.result = officeConv2AlignedText(res.office.srcs, res.office.tgts, opt)
    return res
}


export function officeCount(res: ProceedResult, ext: string): ProceedResult {
    if (res.office === undefined) {
        return res
    }
    const sumCount: CountResult = {
        name: "SUMMERY",
        charas: 0,
        words: 0,
    }
    const delimiter = ext === "csv" ? "," : "\t"
    res.count = []
    res.count.push(sumCount)
    res.office.srcs.forEach(file => {
        const countInFile: CountResult = {
            name: file.name,
            charas: 0,
            words: 0
        }
        file.exts.forEach(ext => {
            if (ext.isActive) {
                countInFile.charas += ext.sumCharas
                countInFile.words += ext.sumWords
            }
        })
        res.count?.push(countInFile)
        sumCount.charas += countInFile.charas
        sumCount.words += countInFile.words
    })
    res.result.push(`NAME${delimiter}CHARAS${delimiter}WORDS`)
    res.count.forEach(file => {
        res.result.push(`${file.name}${delimiter}${file.charas}${delimiter}${file.words}`)
    })
    return res
}

export function officeDiff(res: ProceedResult, opt: ReadingOption): ProceedResult {
    if (res.office === undefined) {
        return res
    }
    else {
        const diff = new DiffCalculator()
        diff.setOptions(opt)
        diff.analyze(res.office.srcs)
        diff.calcWWC(opt.common.countUnit, opt.wwc)
        res.diffs = diff.dsegs
        res.wwc = diff.report
        return res
    }

}