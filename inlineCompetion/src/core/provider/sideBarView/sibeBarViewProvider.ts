import * as vscode from "vscode";
import { VsCodeWebviewProtocol } from "../../../extension/webviewProtocol";
import * as path from "path";
import * as chokidar from "chokidar";
export function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
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
    // 判断环境
    if (process.env.NODE_ENV === "development") {
      // 监听静态资源变化
      const staticDir = path.join(this._context.extensionPath, "gui");
      const watcher = chokidar.watch(staticDir, {
        ignored: /(^|[\/\\])\../, // 忽略隐藏文件
        persistent: true,
        ignoreInitial: true,
      });
      const fileChange = (filePath: string) => {
        console.log("file123", filePath);
        webviewView.webview.html = this.getSidebarContent(webviewView.webview);
        // panel.webview.postMessage({
        //   type: 'static-resource-update',
        //   file: path.basename(filePath)
        // });
      };
      // 处理文件变化事件
      watcher
        .on("add", (file) => fileChange(file))
        .on("change", (file) => fileChange(file))
        .on("unlink", (file) => fileChange(file));
      this._webviewView.onDidDispose(() => {
        watcher.close();
      });
    }
  }
  private getSidebarContent(webview: vscode.Webview) {
    // 配置
    webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
      portMapping: [
        {
          extensionHostPort: 6789,
          webviewPort: 6789,
        },
      ],
    };
    //js资源
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "gui/assets", "index.js")
    );
    //css
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "gui/assets", "index.css")
    );
    const nonce = getNonce();
    this.webviewProtocol.webview = webview;
    return `
			<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">

					<link href="${styleUri}" rel="stylesheet">

					<title>Base View Extension</title>
				</head>
				<body>
					<script>
						const vscode = acquireVsCodeApi();
					</script>

					<div id="app"></div>

					<script type="module" nonce="${nonce}" src="${scriptUri}"></script>
				</body>
			</html>`;
  }
}
