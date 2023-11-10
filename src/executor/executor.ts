import { useResponseMessage } from "../util/util"
import { officeExecutor } from "./officeExecutor"

export async function executor(exec: ExecutableOption): Promise<ProceedResult> {
    return new Promise(async (resolve, reject) => {
        if (exec.isExecutable === false) {
            const message = useResponseMessage({
                isErr: true,
                code: "401",
                name: "Not Executable",
                message: "ExecutableOption::isExecutable is false"
            })
            reject(message)
        }
        else {
            fileProceed(exec)
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        }
    })
}

function fileProceed(exec: ExecutableOption): Promise<ProceedResult> {
    return new Promise((resolve, reject) => {
        switch (exec.mode1) {
            case "OFFICE":
                officeExecutor(exec)
                    .then(res => {
                        resolve(res)
                    })
                    .catch(err => {
                        reject(err)
                    })
                break
        
            default:
                break;
        }
    })
}
