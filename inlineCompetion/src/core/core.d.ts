export interface Range {
  start: Position;
  end: Position;
}
export interface Position {
  line: number;
  character: number;
}
// fim模版及停止生成字符
export type modelFimTemplate = {
  template:string;
  completionOptions:{
    stop : string[]
  }
}