import * as vscode from "vscode";

async function dynamicImportAndActivate(context: vscode.ExtensionContext) {
  const { activateExtension } = await import("./activation/activate");
  return await activateExtension(context);
}

/**
 * 当扩展被激活时调用的函数。
 * 扩展在命令首次执行时被激活。
 *
 * @param context - 扩展的上下文对象，用于管理扩展的生命周期和资源。
 */
export function activate(_context: vscode.ExtensionContext) {
  return dynamicImportAndActivate(_context);
}

// This method is called when your extension is deactivated
export function deactivate() {}
