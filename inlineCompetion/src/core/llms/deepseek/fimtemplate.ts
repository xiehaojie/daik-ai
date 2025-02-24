import { modelFimTemplate } from "../../core";
// https://huggingface.co/deepseek-ai/deepseek-coder-1.3b-base
export const deepseekFimTemplate: modelFimTemplate= {
    template:
      "<｜fim▁begin｜>{{{prefix}}}<｜fim▁hole｜>{{{suffix}}}<｜fim▁end｜>",
    completionOptions: {
      stop: [
        "<｜fim▁begin｜>",
        "<｜fim▁hole｜>",
        "<｜fim▁end｜>",
        "//",
        "<｜end▁of▁sentence｜>",
      ],
    },
  };