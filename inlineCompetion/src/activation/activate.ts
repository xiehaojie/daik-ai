
import { ExtensionContext} from "vscode";
import { VsCodeExtension } from "../extension/VsCodeExtension";

export async function activateExtension(context: ExtensionContext) {

    const vscodeExtension = new VsCodeExtension(context);
  
  }