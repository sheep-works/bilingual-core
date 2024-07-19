import { write, writeFileSync } from "fs"
import { useResponseMessage, str2NameAndExtension } from "../util/util"

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

            case "txt": {
                writeFileSync(output, res.result.join("\n"))
                break;
            }

            case "csv":
            case "tsv": {
                writeFileSync(output, res.result.join("\n"))
                const message = useResponseMessage({
                    isErr: false,
                    code: "200",
                    name: "SUCCESS",
                })
                resolve(message)
                break
            }

            case "json": {
                writeFileSync(output, JSON.stringify(res))
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
