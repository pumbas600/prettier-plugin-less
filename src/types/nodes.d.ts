/*
 * Non comprehensive typing of the CSS AST provided by Prettier.
 * These types are added to as needed, and changed as I observe more
 * about the different nodes.
 */

export type AnyNode = ValueCommaGroupNode | ValueNode;

export interface ValueCommaGroupNode {
  type: "value-comma_group";
  groups: ValueNode[];
}

export type ValueNode =
  | ValueFuncNode
  | ValueWordNode
  | ValueAtWordNode
  | ValueNumberNode;

export interface ValueFuncNode extends BaseValueNode {
  type: "value-func";
  group: any;
}

export interface ValueWordNode extends BaseValueNode {
  type: "value-word";
  isColor: boolean;
  isHex: boolean;
}

export interface ValueAtWordNode extends BaseValueNode {
  type: "value-atword";
}

export interface ValueNumberNode extends BaseValueNode {
  type: "value-number";
  unit: string;
}

export interface BaseValueNode {
  value: string;
  sourceIndex: number;
}
