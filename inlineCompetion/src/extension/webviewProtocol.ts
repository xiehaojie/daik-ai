import * as vscode from "vscode";
import { v4 as uuidv4 } from "uuid";
export class VsCodeWebviewProtocol {
  _webview!: vscode.Webview;
  _webviewListener?: vscode.Disposable;
  constructor() {}
  send(messageType: string, data: any, messageId?: string): string {
    const id = messageId ?? uuidv4();
    this.webview?.postMessage({
      messageType,
      data,
      messageId: id,
    });
    return id;
  }
  get webview(): vscode.Webview | undefined {
    return this._webview;
  }
  set webview(webView: vscode.Webview) {
    this._webview = webView;
    this._webviewListener?.dispose();
    this._webviewListener = this._webview.onDidReceiveMessage((msg)=>{
        // webview 接收到数据后有什么操作？
        console.log('接收到的vue页面值：',msg);
    });
  }

  
//   public request<T extends keyof ToWebviewProtocol>(
//     messageType: T,
//     data: ToWebviewProtocol[T][0],
//     retry: boolean = true,
//   ): Promise<ToWebviewProtocol[T][1]> {
//     const messageId = uuidv4();
//     return new Promise(async (resolve) => {
//       if (retry) {
//         let i = 0;
//         while (!this.webview) {
//           if (i >= 10) {
//             resolve(undefined);
//             return;
//           } else {
//             await new Promise((res) => setTimeout(res, i >= 5 ? 1000 : 500));
//             i++;
//           }
//         }
//       }

//       this.send(messageType, data, messageId);

//       if (this.webview) {
//         const disposable = this.webview.onDidReceiveMessage(
//           (msg: Message<ToWebviewProtocol[T][1]>) => {
//             if (msg.messageId === messageId) {
//               resolve(msg.data);
//               disposable?.dispose();
//             }
//           },
//         );
//       } else if (!retry) {
//         resolve(undefined);
//       }
//     });
//   }
}
