import * as vscode from "vscode";



import { LLM } from "../core/llms/llms";
import { SidebarProvider } from "../core/provider/sideBarView/sibeBarViewProvider";

//聊天问答答案
const getChatAnswer = async (
  msg: any,
  model: LLM,
  webView: SidebarProvider
) => {
  console.log("聊天内容：：", msg);
  const ans = await model.chat([msg[0].data]);
  console.log("指令返回给webview:", ans);
  webView.webviewProtocol.send(msg[0].messageType, ans, msg[0].messageId);
};

// 打开设置
const getSetting = () => {
  // 打开插件设置
  vscode.commands.executeCommand("workbench.action.", "daik");
};
export function getCommandsList() {
  const commandsList = new Map();
  // 获取聊天问答答案
  commandsList.set("daik.getChatAnswer", getChatAnswer);
  // sidebar左上角设置
  commandsList.set("daik.openSetting", 1);
  // sidebar左上角更多
  commandsList.set("daik.more", 1);
  return commandsList;
}
