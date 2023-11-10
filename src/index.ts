import { executor } from "./executor/executor"
import { outputProceed } from "./serverIO/fileWrite"
import { makeExcecutableOption } from "./serverIO/fileRead"
import { createOption, createExecuteOptionTemplate, parsePresetToExecuteOption } from "./util/option"

const demoFiles = ["./demo/demo.docx", "./demo/demo.xlsx", "./demo/demo.pptx"]
const opt = createOption()
const exopt = createExecuteOptionTemplate()
exopt.srcs = demoFiles
exopt.tgts = demoFiles
const exec = makeExcecutableOption({ ...exopt, opt })
exec.mode1 = "OFFICE"
exec.mode2 = "COUNT tsv"
exec.output = "./demo/demo.tsv"
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

