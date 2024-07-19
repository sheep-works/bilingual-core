export class CountWrapper {
  public moduleName = 'Count'

  public opt?: ReadingOption;

  constructor(opt?: ReadingOption, wwc?: WWCRate) {
    if (opt) {
      this.opt = opt
    }
  }

  public officeCalcSimple(files: OfficeContent[], unit: 'chara' | 'word', opt: ReadingOption): string[] {
    let totalSum = 0;
    const unitStr = unit === 'chara' ? '文字数' : '単語数';
    const result: string[] = [`ファイル名\t${unitStr}`, ''];
    // const spaces = new RegExp('\\s+', 'g');
    // const marks = new RegExp('(\\,|\\.|:|;|\\!|\\?|\\s)+', 'g');
    for (const file of files) {
      let sum = 0;
      for (const ext of file.exts) {
        if (!ext.isActive) {
          if (file.format === 'xlsx') {
            if (!opt.office.excel.readHiddenSheet) {
              continue
            }
          } else {
            continue;
          }
        }
        if (unit === 'chara') {
          sum += ext.sumCharas;
        } else if (unit === 'word') {
          sum += ext.sumWords;
        }
      }
      totalSum += sum;
      result.push(`${file.name}\t${sum}`);
    }
    result[1] = `総計\t${totalSum}`;
    return result;
  }

  public officeCalcSimpleOneFile(
    file: OfficeContent,
    unit: 'chara' | 'word',
    opt: ReadingOption, part?: SeparateMark): { subs: number[], sum: number, partial: number } {
    const partMark: SeparateMark = part || 'PPT-Note';
    const subs: number[] = [];
    let sum: number = 0
    let partial: number = 0
    for (const ext of file.exts) {
      if (!ext.isActive) {
        if (file.format === 'xlsx') {
          if (!opt.office.excel.readHiddenSheet) {
            subs.push(0);
            continue;
          }
        } else {
          subs.push(0);
          continue;
        }
      }
      const insum = unit === 'chara' ? ext.sumCharas : ext.sumWords;
      subs.push(insum);
      sum += insum
      if (ext.type === partMark) {
        partial += insum
      }
    }
    return { subs, sum, partial };
  }
}