import OpenAI from "openai";
export interface LLMBase{
    option:any;
    client:OpenAI;  
}


export interface LLM  extends LLMBase{
    chat (): Promise<string>;
    fimWithStream(): Promise<string>;
    fimWithOpenAI(
        prefix:string, suffix:string
    ): Promise<string>;
  
  }