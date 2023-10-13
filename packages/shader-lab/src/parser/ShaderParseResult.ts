import { IShaderInfo, ISubShaderInfo } from "@galacean/engine-design";
import { AstNode, IShaderAstContent } from "../ast-node";
import RuntimeContext from "../RuntimeContext";

export class ShaderParseResult implements IShaderInfo {
  name: string;
  subShaders: ISubShaderInfo[];
  pluginRes: any;

  constructor(ast: AstNode<IShaderAstContent>, ctx: RuntimeContext) {
    this.name = ast.content.name;
    this.subShaders = ast.content.subShader.map((ast) => ctx.parseSubShaderInfo(ast));
    this.pluginRes = ast.content.pluginRes;
  }
}
