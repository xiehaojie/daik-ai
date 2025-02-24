import * as vscode from "vscode";
export class SidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewId = "daik-view-sidebar";
  constructor(protected _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    console.log('this.context.extensionUri',this._extensionUri);
    // 配置
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };
    // html内容
    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
  }
  
	private _getHtmlForWebview(webview: vscode.Webview) {
		// Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'gui/assets', 'index.js'));

		// Do the same for the stylesheet.
		const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'gui/assets', 'index.css'));
		// handleMessages(webview)
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

					<div id="app">123</div>

					<script type="module" src="${scriptUri}"></script>
				</body>
			</html>`;
	}
}
