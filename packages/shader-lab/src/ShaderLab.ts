import { AstNodeUtils } from "./AstNodeUtils";
import { IShaderLab, IShaderLabPlugin } from "@galacean/engine-design";
import { ShaderParser } from "./parser/ShaderParser";
import { ShaderVisitor } from "./ShaderVisitor";

export class ShaderLab implements IShaderLab {
  private _parser: ShaderParser;
  private _visitor: ShaderVisitor;

  get parser() {
    return this._parser;
  }

  constructor(plugins?: IShaderLabPlugin[]) {
    this._parser = new ShaderParser(plugins);
    this._visitor = new ShaderVisitor(plugins);
  }

  parseShader(shaderSource: string) {
    return AstNodeUtils.parseShader(shaderSource, this._parser, this._visitor);
  }
}
