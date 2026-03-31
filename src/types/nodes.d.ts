/*
 * Non comprehensive typing of the CSS AST provided by Prettier.
 * These types are added to as needed, and based purely on my observations while debugging outputs.
 */

export type AnyNode =
  | ValueCommaGroupNode
  | ValueNode
  | CssAtRuleNode
  | CssRuleNode;

/* ─── CSS at-rule (e.g. mixin calls) ──────────────────────────────────────── */

export interface CssAtRuleNode {
  type: "css-atrule";
  name: string;
  mixin: boolean;
  raws: { params?: string; [key: string]: unknown };
  /* The params string is parsed into a selector object at print time. */
  selector?: CssAtRuleSelectorRootNode;
}

export interface CssAtRuleSelectorRootNode {
  nodes: CssAtRuleSelectorNode[];
}

export interface CssAtRuleSelectorNode {
  nodes: CssAtRuleSelectorClassNode[];
}

export interface CssAtRuleSelectorClassNode {
  type: "selector-class";
  value: string;
}

/* ─── CSS rule (e.g. Less mixin definitions with `when` guards) ───────────── */

export interface CssRuleNode {
  type: "css-rule";
  selector: SelectorRootNode;
  nodes: AnyNode[];
}

export type SelectorNode =
  | SelectorTagNode
  | SelectorCombinatorNode
  | { type: string; value?: string; [key: string]: unknown };

export interface SelectorTagNode {
  type: "selector-tag";
  value: string;
}

export interface SelectorCombinatorNode {
  type: "selector-combinator";
  value?: string;
}

export interface SelectorSelectorNode {
  type: "selector-selector";
  nodes: SelectorNode[];
}

export interface SelectorRootNode {
  type: "selector-root";
  nodes: SelectorSelectorNode[];
}

/* ─── Value nodes ─────────────────────────────────────────────────────────── */

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
  group: unknown;
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
