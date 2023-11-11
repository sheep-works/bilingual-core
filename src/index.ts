import { executor } from "./executor/executor"
import { outputProceed } from "./serverIO/fileWrite"
import { makeExcecutableOption } from "./serverIO/fileRead"
import { parsePresetToExecuteOption } from "./util/option"
import { readFileSync } from "fs"

const configFile = "./config.json"
const config = JSON.parse(readFileSync(configFile).toString()) as PresetOptions
const exopt = parsePresetToExecuteOption(config)
const exec = makeExcecutableOption(exopt)
exec.isExecutable = true
executor(exec)
    .then(res => {
        outputProceed(res, exec.output)
            .then(message => {
                console.log(message)
            })
            .catch(message => {
                console.log(message)
            })
    })
    .catch(message => {
        console.log(message)
    })

