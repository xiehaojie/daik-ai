import { modelFimTemplate } from "../../core";
// https://github.com/QwenLM/Qwen2.5-Coder?tab=readme-ov-file#3-file-level-code-completion-fill-in-the-middle
export const qwenCoderFimTemplate: modelFimTemplate = {
  template:
    "<|fim_prefix|>{{{prefix}}}<|fim_suffix|>{{{suffix}}}<|fim_middle|>",
  completionOptions: {
    stop: [
      "<|endoftext|>",
      "<|fim_prefix|>",
      "<|fim_middle|>",
      "<|fim_suffix|>",
      "<|fim_pad|>",
      "<|repo_name|>",
      "<|file_sep|>",
      "<|im_start|>",
      "<|im_end|>",
    ],
  },
};
