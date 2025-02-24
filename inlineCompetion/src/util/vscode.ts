import * as vscode from "vscode";
export function getExtensionUri(): vscode.Uri {
    console.log('vs');
    return vscode.extensions.getExtension("Continue.continue")!.extensionUri;
  }