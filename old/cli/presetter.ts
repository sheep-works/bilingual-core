import { writeFileSync } from 'fs'


export function writeDefaultPreset() {
  const defaultPreset = `
    # ------------------------------------------------------------
    # [mode]
    # Select from the followings:
      # - 'OFFICE:EXTRACT txt'
      # - 'OFFICE:EXTRACT json'
      # - 'OFFICE:EXTRACT-DIFF json'
      # - 'OFFICE:EXTRACT-DIFF tovis' 
      # - 'OFFICE:EXTRACT-DIFF min-tovis' 
      # - 'OFFICE:ALIGN tsv' 
      # - 'OFFICE:ALIGN-DIFF html' 
      # - 'COUNT:CHARAS tsv'
      # - 'COUNT:WORDS tsv'
      # - 'COUNT:DIFF-CHARAS tsv'
      # - 'COUNT:DIFF-WORDS tsv'
      # - 'CAT:EXTRACT tsv'
      # - 'CAT:EXTRACT-DIFF json'
      # - 'CAT:EXTRACT-DIFF tovis'
      # - 'CAT:EXTRACT-DIFF min-tovis'
      # - 'CAT:UPDATE xliff'
    # If the selection is not proper, then the mode will be set as 'OFFICE:EXTRACT txt' implicity
    # OFFICE supports: docx / docm / xlsx / xlsm / pptx / pptm / pdf
    # CAT supports: xliff / mxliff / tmx / tbx
    # ------------------------------------------------------------
    mode: 'OFFICE:EXTRACT txt'
  
    # ------------------------------------------------------------
    # [console]
    # Set true if you do not want to create a file
    # ------------------------------------------------------------
    console: false
  
    # ---------------
    # [outputFile]
    # Set a filename to output (default: preset)
    # It is NOT mandantory, and be ignored when the console is true
    # When set '!DEBUG!', the system would enter DEBUG mode, it does not create file
    # and neither display the result on console.
    # ---------------
    outputFile: './result.txt'
  
    # ---------------
    # [sourceFiles]
    # list up the source file(s) or folder(s)
    # ---------------
    sourceFiles:
      - './jp/'
      
    # ---------------
    # [targetFiles]
    # list up the target file(s) or folder(s)
    # ---------------
    targetFiles:
      - ./en/
  
    # ---------------
    # [office]
    # Setting for detailed extraction (for office files)
    # ---------------
    office:
      common:
        segmentation: true
        delimiters: '(。|！|？|(\. )|(\! )|(\? ))'
        excludePattern: ''
        withSeparator: true
  
      word:
        rev: true
      excel:
        readHiddenSheet: false
        readFilledCell: true
      ppt:
        readSlide: true
        readNote: true
  
    # ---------------
    # [cat] 
    # Setting for detailed extraction (for CAT files)
    # ---------------
    cat:
      locales: 'all'
      fullset: false
      overWrite: false
  
    # ---------------
    # [WWC] 
    # Setting for Weighted Word Count(for COUNT)
    # ---------------
    wwc:
      dupli: 0.15
      over95: 0.3
      over85: 0.6
      over75: 0.8
      over50: 1
      under49: 1
  
    # ------------------------------------------------------------
    # [debug]
    # Not create output file, nor display on console.
    # It is prior to the console and outputfile option. 
    # ------------------------------------------------------------
    debug: false
    `
  writeFileSync('./preset.yaml', defaultPreset)
  console.log('Default preset.yaml has been set: "./preset.yaml"')
}