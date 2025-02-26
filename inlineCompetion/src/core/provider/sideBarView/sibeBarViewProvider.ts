import * as vscode from "vscode";
import { VsCodeWebviewProtocol } from "../../../extension/webviewProtocol";
export class SidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewId = "daik-view-sidebar";
  //通信
  public webviewProtocol: VsCodeWebviewProtocol;
  private _webview?: vscode.Webview;
  private _webviewView?: vscode.WebviewView;
  constructor(
    protected _extensionUri: vscode.Uri,
    private _context: vscode.ExtensionContext
  ) {
    // 通信初始化
    this.webviewProtocol = new VsCodeWebviewProtocol();
  }
  get isVisible() {
    return this._webviewView?.visible;
  }
  get webview() {
    return this._webview;
  }
  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._webviewView = webviewView;
    this._webview = webviewView.webview;
    // html内容
    webviewView.webview.html = this.getSidebarContent(webviewView.webview);
  }
  private getSidebarContent(webview: vscode.Webview) {
    // 配置
    webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };
    //js资源
    let scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "gui/assets", "index.js")
    );
    console.log(
      "vscode::",
      this._context.extensionMode,
      "meiju:",
      vscode.ExtensionMode.Development,
      "ce",
      ""
    );
    //css
    let styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "gui/assets", "index.css")
    );
    this.webviewProtocol.webview = webview;
    return `
			<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">

					<link href="${styleMainUri}" rel="stylesheet">

					<title>Base View Extension</title>
				</head>
				<body>
					<script>
						const vscode = acquireVsCodeApi();
					</script>

					<div id="app"></div>

					<script type="module" src="${scriptUri}"></script>
				</body>
			</html>`;
  }
}
