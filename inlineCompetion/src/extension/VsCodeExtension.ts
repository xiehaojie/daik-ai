import * as vscode from "vscode";
import { llmOpenAI } from "../core";
import { AutocompleteDebouncer } from "../core/util/debouncer";
import { DAIKCompletionProvider } from "../core/provider/autoCompetion/DAIKCompletionProvider";
import { SidebarProvider } from "../core/provider/sideBarView/sibeBarViewProvider";
import { VsCodeWebviewProtocol } from "./webviewProtocol";

export class VsCodeExtension {
  // openai客户端初始化
  private llmOpenAI: llmOpenAI;
  // 配置
  private setting: any;
  // 防抖函数
  private debouncer: AutocompleteDebouncer;

  constructor(context: vscode.ExtensionContext) {
    // 需要获取配置信息
    // vscode.workspace.getConfiguration("fim");
    // 获取配置列表
    this.setting = {
      // 补全模型
      fim: {
        type: "openai",
        oAuth: {
          appId: "",
          apiKey: "",
          secretKey: "",
        },
        modelType: "qwen",
        openAI: {
          apiKey: "sk-qewbjoukxuvvykxbssrtvsytvtghodzqmurainijcizrjtzy",
          baseURL: "https://api.siliconflow.cn/v1",
          model: "Qwen/Qwen2.5-Coder-7B-Instruct",
        },
        stream: {},
      },
      // 聊天模型
      chat: {
        type: "openai",
        oAuth: {
          appId: "",
          apiKey: "",
          secretKey: "",
        },
        modelType: "qwen",
        openAI: {
          apiKey: "sk-qewbjoukxuvvykxbssrtvsytvtghodzqmurainijcizrjtzy",
          baseURL: "https://api.siliconflow.cn/v1",
          model: "Qwen/Qwen2.5-Coder-7B-Instruct",
        },
        stream: {},
      },
    };

    // 配置模型
    this.llmOpenAI = new llmOpenAI(this.setting);
    // 防抖函数配置
    this.debouncer = new AutocompleteDebouncer();
    // 构建sieBarWebview
    const sideBarWebview = new SidebarProvider(context.extensionUri, context);
    // 注册行内补全
    context.subscriptions.push(
      vscode.languages.registerInlineCompletionItemProvider(
        [{ pattern: "**" }],
        new DAIKCompletionProvider(
          this.llmOpenAI,
          this.debouncer,
          sideBarWebview.webviewProtocol
        )
      )
    );
    //注册容器sidBarWebview
    context.subscriptions.push(
      vscode.window.registerWebviewViewProvider(
        SidebarProvider.viewId,
        sideBarWebview,
        {
          webviewOptions: { retainContextWhenHidden: true },
        }
      )
    );

    // 指令创建
    const getChatAnswer = async (msg: any) => {
      console.log("聊天内容：：", msg);
      const ans = await this.llmOpenAI.chat.model?.chat([msg[0].data]);
      console.log("指令返回给webview:", ans);
      sideBarWebview.webviewProtocol.send(
        msg[0].messageType,
        ans,
        msg[0].messageId
      );
    };
    // 注册指令
    context.subscriptions.push(
      vscode.commands.registerCommand("daik.getChatAnswer", getChatAnswer)
    );
  }
}
