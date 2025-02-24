import OpenAI from "openai";
import { LLM } from "../llms";

export class Qwen implements LLM{
  option: any;
  client: OpenAI;
  constructor(option: any, client: OpenAI) {
    this.option = option;
    this.client = client;
  }
  chat(): Promise<string> {
    throw new Error("Method not implemented.");
  }
  fimWithStream(): Promise<string> {
    throw new Error("Method not implemented.");
  }
  // openAI请求
  async fimWithOpenAI(prefix: string, suffix: string) {
    const completion = await this.client.completions.create({
      model: this.option.openAI.model,
      prompt: prefix,
      suffix,
      stream: true,
    });
    let str = "";
    for await (const chunk of completion) {
      str += chunk.choices[0].text;
    }
    return str;
  }
}
