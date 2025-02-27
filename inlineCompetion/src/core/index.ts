
import OpenAI from "openai";
import { Qwen } from "./llms";
import { LLM } from "./llms/llms";
// 代码补全模型
class FimModel {
  model: LLM | undefined ;
  constructor(fimSetting:any) {

    if (fimSetting.type === 'openai') {
        this.model = selectModelByModelType(fimSetting);
    }
  }
}


class ChatModel {
  model: LLM | undefined ;
  constructor(chatSetting:any) {
    if (chatSetting.type === 'openai') {
        this.model = selectModelByModelType(chatSetting);
    }
  }
}
/**
 * 根据模型类型选择合适的模型实例。
 * @param {any} setting - 模型配置对象，包含模型类型和相关配置信息。
 * @returns {any} - 根据模型类型返回相应的模型实例，如果不匹配则返回空对象。
 */
 function selectModelByModelType(setting:any): any{
    if (setting.modelType === 'qwen') {
        const qwenClient = new OpenAI({
          apiKey:setting.openAI.apiKey,
          baseURL:setting.openAI.baseURL,
          
      });
        return new Qwen(setting,qwenClient);
    }
    return {};
}

export class llmOpenAI {
  // fim模型
    fim: FimModel;
  // chat模型
    chat: ChatModel;

  constructor(setting: any) {
    this.fim = new FimModel(setting.fim);
    this.chat = new ChatModel(setting.chat);
  }
}
