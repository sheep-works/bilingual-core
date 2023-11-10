import { useResponseMessage } from "../util/util"
import { officeExtract } from "../office/officeEntry"

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
                    switch (exec.mode2) {
                        case "EXTRACT txt":
                            resolve(officeExtractTxt(res))
                            break

                        case "EXTRACT json":
                            resolve(officeExtractJson(res))
                            break

                        case "ALIGN tsv":
                            resolve(officeAlignTsv(res, exec.opt))
                            break

                        case "COUNT tsv":
                            resolve(officeCountTsv(res))
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
            const office = await officeExtract(exec.srcFiles, exec.tgtFiles, exec.opt)
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


function officeConv2SimplifiedText(contents: OfficeContent[]): string[][] {
    const results: string[][] = []
    for (const file of contents) {
        const result: string[] = [file.name]
        for (const text of file.exts) {
            if (text.isActive) {
                result.push(...text.value)
            }
        }
        results.push(result)
    }
    return results
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

function officeExtractTxt(res: ProceedResult): ProceedResult {
    if (res.office === undefined) {
        return res
    }
    const texts = officeConv2SimplifiedText(res.office.srcs)
    texts.forEach(text => {
        res.result.push(text.join(""))
    })
    return res
}

function officeExtractJson(res: ProceedResult): ProceedResult {
    if (res.office === undefined) {
        return res
    }
    res.office.srcs.forEach(file => {
        res.result.push(JSON.stringify(file, null, 2))
    })
    res.office.tgts.forEach(file => {
        res.result.push(JSON.stringify(file, null, 2))
    })
    return res
}

function officeAlignTsv(res: ProceedResult, opt: ReadingOption): ProceedResult {
    if (res.office === undefined) {
        return res
    }
    res.result = officeConv2AlignedText(res.office.srcs, res.office.tgts, opt)
    return res
}


function officeCountTsv(res: ProceedResult): ProceedResult {
    if (res.office === undefined) {
        return res
    }
    const sumCount: CountResult = {
        name: "SUMMERY",
        charas: 0,
        words: 0,
    }
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
    res.result.push("NAME\tCHARAS\tWORDS")
    res.count.forEach(file => {
        res.result.push(`${file.name}\t${file.charas}\t${file.words}`)
    })
    return res
}