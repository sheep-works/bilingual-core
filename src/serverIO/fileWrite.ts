import { writeFileSync } from "fs"
import { useResponseMessage } from "../util/util"

export function outputProceed(res: ProceedResult, output: string): Promise<ResponseMessage> {
    return new Promise((resolve, reject) => {
        const [name, ext] = str2NameAndExtension(output)
        switch (ext) {
            case "":
            case "console": {
                console.log(res.result)
                const message = useResponseMessage({
                    isErr: false,
                    code: "200",
                    name: "SUCCESS",
                })
                resolve(message)
                break
            }

            case "csv":
            case "tsv": {
                writeFileSync(output,
                    ext === "tsv" ? res.result.join("\n") : res.result.join("\n").replace("\t", ","))
                const message = useResponseMessage({
                    isErr: false,
                    code: "200",
                    name: "SUCCESS",
                })
                resolve(message)
                break
            }

            case "json": {
                writeFileSync(output, res.result[0])
                const message = useResponseMessage({
                    isErr: false,
                    code: "200",
                    name: "SUCCESS",
                })
                resolve(message)
            }


            default:
                const message = useResponseMessage({
                    isErr: true,
                    code: "402",
                    name: "Invalid Output",
                    message: `ExecutableOption::output is invalid -${output}`
                })
                reject(message)
                break
        }
    })
}

function str2NameAndExtension(str: string): [string, string] {
    const strs = str.split(".")
    if (strs.length === 1) {
        return ["", strs[0]]
    }
    else if (strs.length === 2) {
        return [strs[0], strs[1]]
    }
    else {
        const last = strs[strs.length - 1]
        const others = strs.slice(0, strs.length - 1)
        return [others.join("."), last]
    }

}