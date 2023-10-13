import { CstChildrenDictionary, TokenType } from "chevrotain";

export type RuleFunction = () => void;
export type RuleVisitorFunction = (children: CstChildrenDictionary) => any;
export interface ISubRule {
  rule: RuleFunction;
  ruleName: string;
  visitor?: RuleVisitorFunction;
}

export interface IShaderLabPlugin {
  /** Sub rules under shader block */
  shaderSubRules?: ISubRule[];
  /** Sub rules under subShader block */
  subShaderSubRules?: ISubRule[];
  /** Sub rules under pass block */
  passSubRules?: ISubRule[];
  tokens: (TokenType | string)[];
  subRules?: ISubRule[];
}
