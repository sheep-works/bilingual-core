import { statSync, readFileSync, writeFileSync } from 'fs'
import { load } from 'js-yaml'

import { parsePresetToExecuteOption } from '../src/util/option'
import { selectLargeDialog, selectOfficeDialog, selectCountDialog, selectCatDialog } from '../src/cli/dialogs'
import { writeDefaultPreset } from '../src/cli/presetter'
// import { ModeLarge, ModeMiddleCat, ModeMiddleCount, ModeMiddleOffice, modeCombinations } from 'util/params'

// #起動時に処理される部分
console.log('------------------------');
const program = require('commander');
program
  .option('-p, --preset', 'Use this flag for executing with pre-designated params')
  .option('-y, --yaml <item>', 'Designate the yaml file for preset')
  .option('--default-preset', 'Create the default preset file')

const args: any = program.parse(process.argv);

// デフォルトのプリセットファイルの書き出し
if (args.defaultPreset) {
  writeDefaultPreset()
}
// プリセットモードを実行する場合
else if (args.preset) {
  // const ctrl = new CLIController()
  // yaml ファイルの正規化
  let presetYaml =
    args.yaml === undefined ? './preset.yaml' :
      (args.yaml.endsWith('.yaml')) || (args.yaml.endsWith('.yml')) ? args.yaml :
        `${args.yaml}.yaml`;
  // 指定ファイルの存在を確認する。
  // なかった場合は presets フォルダを確認し、それでもなければ'./preset.yaml' を使用する
  try {
    statSync(presetYaml);
  }
  catch {
    try {
      statSync(`./presets/${presetYaml}`);
      presetYaml = `./presets/${presetYaml}`;
    }
    catch
    {
      console.log(`${args.yaml} does not exist`);
      presetYaml = './preset.yaml';
    }
  }
  // プリセットファイルの読み込み
  const presetOptions = load(readFileSync(presetYaml).toString()) as PresetOptions;
  const eopt = parsePresetToExecuteOption(presetOptions)
  executor(eopt)
    .then(res => {

    })
    .catch(res => {

    })
}
// ダイアログの実行
else {
  // const ctrl = new CLIController()
  selectLargeDialog()
    .then(lg => {
      switch (lg) {
        case 'DEFAULT PRESET':
          writeDefaultPreset();
          break;

        case 'OFFICE':
          selectOfficeDialog(args.args[0])
            .then(eopt => {
              executor(eopt)
                .then(res => {

                })
                .catch(res => {

                })
            })
            .catch(() => { console.log('GOT ERROR') })
          break;

        case 'COUNT':
          selectCountDialog(args.args[0])
            .then(eopt => {
              executor(eopt)
                .then(res => {

                })
                .catch(res => {

                })
            })
          .catch(() => { console.log('GOT ERROR') })
          break;

        case 'CAT':
          selectCatDialog(args.args[0])
            .then(eopt => {
              executor(eopt)
                .then(res => {

                })
                .catch(res => {

                })
            })
            .catch(() => { console.log('GOT ERROR') })
          break

        default:
          break;
      }
    })
    .catch(() => {
      console.log('Start failed')
    })
}



function executor(edata: ExecutingData): Promise<ResponseMessage> {
  return new Promise((resolve, reject) => {
    if (edata.isExecutable === false) {
      reject()
    }
    switch(edata.mode1) {
      case 'OFFICE': 
        officeExecutor(edata)
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
        break;

      case 'COUNT':
        countExecutor(edata)
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
        break;

      case 'CAT':
        catExecutor(edata)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
        break;

      default:
        reject()
        break
        
    }
  })
}


function officeExecutor(edata: ExecutingData): Promise<ResponseMessage> {
  return new Promise((resolve, reject) => {
    const srcPrs: Promise<OfficeContent>[] = []
    const tgtPrs: Promise<OfficeContent>[] = []
    edata.srcFiles.forEach(src => {
      
    })
  })
}

function countExecutor(edata: ExecutingData): Promise<ResponseMessage> {
  return new Promise((resolve, reject) => {
    
  })
}

function catExecutor(edata: ExecutingData): Promise<ResponseMessage> {
  return new Promise((resolve, reject) => {
    
  })
}