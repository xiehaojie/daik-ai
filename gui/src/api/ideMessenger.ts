import "vscode-webview";
import { v4 as uuidv4 } from "uuid";
declare const vscode: any;

interface vscode {
  postMessage(message: any): vscode;
}

export interface IIdeMessenger {
  send(messageType: string, data: any, messageId: string): void;
  receive(cb: Function): void;
  request(messageType: string, data: any): Promise<any>;

  //   streamRequest<T extends keyof FromWebviewProtocol>(
  //     messageType: T,
  //     data: FromWebviewProtocol[T][0],
  //     cancelToken?: AbortSignal,
  //   ): AsyncGenerator<
  //     GeneratorYieldType<FromWebviewProtocol[T][1]>[],
  //     GeneratorReturnType<FromWebviewProtocol[T][1]> | undefined
  //   >;

  //   llmStreamChat(
  //     modelTitle: string,
  //     cancelToken: AbortSignal | undefined,
  //     messages: ChatMessage[],
  //     options?: LLMFullCompletionOptions,
  //   ): AsyncGenerator<ChatMessage[], PromptLog | undefined>;

  //   ide: IDE;
}

export class IdeMessenger implements IIdeMessenger {
  private _postToIde(msg: any) {
    vscode.postMessage(msg);
  }

  send(messageType: string, data: any, messageId: string) {
    try {
      this._postToIde({ messageType, data, messageId });
    } catch (error) {
      console.log("postError:", error);
    }
  }

  receive(cb: Function): void {
    window.addEventListener("message", (event) => {
      cb(event.data);
    });
  }

  request(messageType: string, data: any): Promise<any> {
    const messageId = uuidv4();

    return new Promise((resolve) => {
      const handler = (event: any) => {
        console.log('eeeeee',event.data);
        if (event.data.messageId === messageId) {
          // 移除监听器
          window.removeEventListener("message", handler);
          resolve(event.data.data);
        }
      };
      // 添加监听器
      window.addEventListener("message", handler);
      this.send(messageType, data, messageId);
    });
  }
  // return new Promise((resolve) => {
  //   const handler = (event:any) => {
  //       resolve(event.data);
  //   };

  //   this.post(messageType, data, messageId);
  // });
}

/**
 * Because of weird type stuff, we're actually yielding an array of the things
 * that are streamed. For example, if the return type here says
 * AsyncGenerator<ChatMessage>, then it's actually AsyncGenerator<ChatMessage[]>.
 * This needs to be handled by the caller.
 *
 * Using unknown for now to make this more explicit
 */
//   async *streamRequest<T extends keyof FromWebviewProtocol>(
//     messageType: T,
//     data: FromWebviewProtocol[T][0],
//     cancelToken?: AbortSignal,
//   ): AsyncGenerator<
//     GeneratorYieldType<FromWebviewProtocol[T][1]>[],
//     GeneratorReturnType<FromWebviewProtocol[T][1]> | undefined
//   > {
//     const messageId = uuidv4();

//     this.post(messageType, data, messageId);

//     const buffer: GeneratorYieldType<FromWebviewProtocol[T][1]>[] = [];
//     let index = 0;
//     let done = false;
//     let returnVal: GeneratorReturnType<FromWebviewProtocol[T][1]> | undefined =
//       undefined;
//     let error: string | null = null;

//     // This handler receieves individual WebviewMessengerResults
//     // And pushes them to buffer
//     const handler = (event: {
//       data: Message<WebviewProtocolGeneratorMessage<T>>;
//     }) => {
//       if (event.data.messageId === messageId) {
//         const responseData = event.data.data;
//         if ("error" in responseData) {
//           error = responseData.error;
//           return;
//           // throw new Error(responseData.error);
//         }
//         if (responseData.done) {
//           window.removeEventListener("message", handler);
//           done = true;
//           returnVal = responseData.content;
//         } else {
//           buffer.push(responseData.content);
//         }
//       }
//     };
//     window.addEventListener("message", handler);

//     const handleAbort = () => {
//       this.post("abort", undefined, messageId);
//     };
//     cancelToken?.addEventListener("abort", handleAbort);

//     try {
//       while (!done) {
//         if (error) {
//           throw error;
//         }
//         if (buffer.length > index) {
//           const chunks = buffer.slice(index);
//           index = buffer.length;
//           yield chunks;
//         }
//         await new Promise((resolve) => setTimeout(resolve, 50));
//       }

//       if (buffer.length > index) {
//         const chunks = buffer.slice(index);
//         yield chunks;
//       }

//       if (!returnVal) {
//         return undefined;
//       }
//       return returnVal;
//     } catch (e) {
//       throw e;
//     } finally {
//       cancelToken?.removeEventListener("abort", handleAbort);
//     }
//   }

//   async *llmStreamChat(
//     modelTitle: string,
//     cancelToken: AbortSignal | undefined,
//     messages: ChatMessage[],
//     options: LLMFullCompletionOptions = {},
//   ): AsyncGenerator<ChatMessage[], PromptLog | undefined> {
//     const gen = this.streamRequest(
//       "llm/streamChat",
//       {
//         messages,
//         title: modelTitle,
//         completionOptions: options,
//       },
//       cancelToken,
//     );

//     let next = await gen.next();
//     while (!next.done) {
//       yield next.value;
//       next = await gen.next();
//     }
//     return next.value;
//   }

export const ideMessenger = new IdeMessenger();
