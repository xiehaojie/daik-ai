import { compile }from "handlebars";
import { getRangeInString } from "../..//prompt/range";
import * as vscode from "vscode";
import { modelFimTemplate } from "../../core";



// 利用Handelbars填充
const getPrompt = (prefix: string, suffix: string, modelTemplate:string) => {
  let template = compile(modelTemplate);
  return template({ prefix, suffix });
};
export const handleDocumentText = (
  text: string,
  position: vscode.Position,
  template: modelFimTemplate
): string => {
  const fileContents = text;
  const fileLines = fileContents.split("\n");
  let prefix = getRangeInString(fileContents, {
    start: { line: 0, character: 0 },
    end: position,
  });
  const suffix = getRangeInString(fileContents, {
    start: position,
    end: { line: fileLines.length - 1, character: Number.MAX_SAFE_INTEGER },
  });
  return getPrompt(prefix, suffix, template.template);
};

// 获取上下文
export const handleDocumentTextWithPreSuf = (
  text: string,
  position: vscode.Position
)=> {
  const fileContents = text;
  const fileLines = fileContents.split("\n");
  let prefix = getRangeInString(fileContents, {
    start: { line: 0, character: 0 },
    end: position,
  });
  let suffix = getRangeInString(fileContents, {
    start: position,
    end: { line: fileLines.length - 1, character: Number.MAX_SAFE_INTEGER },
  });
  return {prefix,suffix};
};