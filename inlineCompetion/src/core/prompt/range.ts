import { Position, Range } from '../core';
/**
 * 从给定的字符串中提取指定范围的文本。
 * @param {string} content - 要提取文本的原始字符串。
 * @param {Range} range - 要提取的文本范围，包含起始和结束位置。
 * @returns {string} 提取的文本，如果范围无效则返回空字符串。
 */
export function getRangeInString(content: string, range: Range): string {
  // 将输入的字符串按换行符分割成多行数组
  const lines = content.split("\n");

  // 检查起始行和结束行是否相同
  if (range.start.line === range.end.line) {
    // 如果相同，直接从该行中提取指定字符范围的文本
    return (
      lines[range.start.line]?.substring(
        range.start.character,
        range.end.character
      ) ?? ""
    );
  }

  // 提取起始行中从起始字符位置到行尾的文本
  const firstLine =
    lines[range.start.line]?.substring(
      range.start.character,
      lines[range.start.line].length
    ) ?? "";
  // 提取中间行的文本
  const middleLines = lines.slice(range.start.line + 1, range.end.line);
  // 提取结束行中从行首到结束字符位置的文本
  const lastLine =
    lines[range.end.line]?.substring(0, range.end.character) ?? "";

  // 将提取的文本片段用换行符连接起来并返回
  return [firstLine, ...middleLines, lastLine].join("\n");
}

export function intersection(a: Range, b: Range): Range | null {
  const startLine = Math.max(a.start.line, b.start.line);
  const endLine = Math.min(a.end.line, b.end.line);

  if (startLine > endLine) {
    return null;
  }

  if (startLine === endLine) {
    const startCharacter = Math.max(a.start.character, b.start.character);
    const endCharacter = Math.min(a.end.character, b.end.character);

    if (startCharacter > endCharacter) {
      return null;
    }

    return {
      start: { line: startLine, character: startCharacter },
      end: { line: endLine, character: endCharacter },
    };
  }

  const startCharacter =
    startLine === a.start.line ? a.start.character : b.start.character;
  const endCharacter =
    endLine === a.end.line ? a.end.character : b.end.character;

  return {
    start: { line: startLine, character: startCharacter },
    end: { line: endLine, character: endCharacter },
  };
}

export function union(a: Range, b: Range): Range {
  let start: Position;
  if (a.start.line === b.start.line) {
    start = {
      line: a.start.line,
      character: Math.min(a.start.character, b.start.character),
    };
  } else if (a.start.line < b.start.line) start = a.start;
  else start = b.start;

  let end: Position;
  if (a.end.line === b.end.line) {
    end = {
      line: a.end.line,
      character: Math.max(a.end.character, b.end.character),
    };
  } else if (a.end.line > b.end.line) end = a.end;
  else end = b.end;

  return {
    start,
    end,
  };
}

export function maxPosition(a: Position, b: Position): Position {
  if (a.line > b.line) {
    return a;
  } else if (a.line < b.line) {
    return b;
  } else {
    return a.character > b.character ? a : b;
  }
}

export function minPosition(a: Position, b: Position): Position {
  if (a.line < b.line) {
    return a;
  } else if (a.line > b.line) {
    return b;
  } else {
    return a.character < b.character ? a : b;
  }
}
