// util
declare interface ReadFailure {
  name: string;
  detail: any;
}

declare interface ResponseMessage {
  isErr: Boolean
  code: string
  name: string
  message: string
  data?: {
    office?: OfficeContent
  }
}

declare type JsonType = 'extract' | 'diff' | 'cat' | 'tovis'

declare type CountType = 'word' | 'chara' | 'both'

declare interface SimpleContent {
  src: string[][],
  tgt: string[][]
}

declare interface ReadData {
  name: string
  data: Buffer | ArrayBuffer
}