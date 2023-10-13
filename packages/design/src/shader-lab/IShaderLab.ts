import { IShaderInfo } from "./IShaderInfo";
import { IShaderLabPlugin } from "./IShaderLabPlugin";

/**
 * Shader lab interface.
 */
export interface IShaderLab {
  /**
   * parsing shader source code.
   */
  parseShader(shaderSource: string, plugins?: IShaderLabPlugin[]): IShaderInfo;
}
