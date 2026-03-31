import { parsers, printers } from "prettier/plugins/postcss";
import { AstPath, ParserOptions } from "prettier";
import { AnyNode, SelectorSelectorNode } from "./types/nodes";
import { builders } from "prettier/doc";

const AST_FORMAT = "prettier-plugin-less-ast";

type Print = (path: AstPath<AnyNode>) => builders.Doc;


/**
 * Normalizes indentation inside a detached ruleset mixin argument, e.g.
 * `.mixin({ &:hover { ... } })`.
 *
 * At print time the postcss printer has already parsed the mixin's `params`
 * string into a `selector-class` node whose `value` is the full class string,
 * e.g. `"mixin-name({\n    body;\n})"`. This function finds the `({...})`
 * block inside that value and re-indents its content to match `tabWidth`.
 */
function normalizeDetachedRulesetInValue(
  classValue: string,
  tabWidth: number,
  useTabs: boolean,
): string {
  const openIdx = classValue.indexOf("({");
  if (openIdx === -1) return classValue;

  const closeIdx = classValue.lastIndexOf("})");
  if (closeIdx <= openIdx) return classValue;

  const content = classValue.slice(openIdx + 2, closeIdx);

  /* Content must be wrapped in newlines: ({\n...\n}) */
  if (!content.startsWith("\n") || !content.endsWith("\n")) return classValue;

  const inner = content.slice(1, -1);
  const lines = inner.split("\n");

  /* Detect the indentation unit from the first indented non-empty line. */
  const firstIndented = lines.find((l) => /^[ \t]+\S/.test(l));
  if (!firstIndented) return classValue;

  const unitMatch = firstIndented.match(/^([ \t]+)/);
  if (!unitMatch) return classValue;

  const unit = unitMatch[1].length;
  const contentUsesTabs = firstIndented.startsWith("\t");

  /* Already using the correct indentation style and size. */
  if (contentUsesTabs === useTabs && (useTabs || unit === tabWidth))
    return classValue;

  const normalized = lines.map((line) => {
    if (!line.trim()) return "";
    const indentLen = line.match(/^([ \t]*)/)?.[1]?.length ?? 0;
    const level = Math.round(indentLen / unit);
    return (
      (useTabs ? "\t" : " ".repeat(tabWidth)).repeat(level) + line.trimStart()
    );
  });

  return (
    classValue.slice(0, openIdx + 2) +
    "\n" +
    normalized.join("\n") +
    "\n" +
    classValue.slice(closeIdx)
  );
}

/**
 * Fixes the `when` guard in a Less mixin definition selector by merging the
 * `when` keyword with its condition node.
 *
 * The selector parser treats `when` as a `selector-tag` and its condition as a
 * trailing `selector-combinator` (e.g. `"\n\t(ispixel(@w))"`), which causes
 * prettier to split them across lines. Merging them into a single node ensures
 * they always stay on the same line.
 *
 * Returns true if a `when` guard was found.
 */
function fixWhenGuardInSelectorAst(
  selectorNodes: SelectorSelectorNode[],
): boolean {
  let found = false;
  for (const selectorSelector of selectorNodes) {
    if (!selectorSelector.nodes) continue;

    const nodes = selectorSelector.nodes;
    const whenIdx = nodes.findIndex(
      (n) => n.type === "selector-tag" && n.value === "when",
    );
    if (whenIdx === -1) continue;

    found = true;

    const nextIdx = whenIdx + 1;
    if (nextIdx >= nodes.length) continue;

    const nextNode = nodes[nextIdx];
    if (nextNode.type !== "selector-combinator") continue;

    /* Strip leading whitespace (newlines, tabs, spaces) to get the condition. */
    const condition = (nextNode.value ?? "").replace(/^\s+/, "");
    if (!condition) continue;

    nodes[whenIdx] = { ...nodes[whenIdx], value: `when ${condition}` };
    nodes.splice(nextIdx, 1);
  }
  return found;
}

/**
 * Adds an extra level of indentation to the rule body when the `when` guard
 * causes the selector to wrap onto multiple lines, using prettier's `ifBreak`
 * so the extra indentation is only applied when the selector actually breaks.
 */
function addWhenGuardBodyIndent(result: builders.Doc): void {
  if (!Array.isArray(result) || result.length < 3) return;

  /* Navigate to the inner selector group to attach a groupId. */
  const outerGroup = result[0];
  if (!isCommand(outerGroup, "group") || !Array.isArray(outerGroup.contents))
    return;

  const innerGroupWrapper = outerGroup.contents[1];
  if (!Array.isArray(innerGroupWrapper) || innerGroupWrapper.length === 0)
    return;

  const innerGroup = innerGroupWrapper[0];
  if (!isCommand(innerGroup, "group")) return;

  const groupId = Symbol("less-when-guard-selector");
  innerGroup.id = groupId;

  /* result[2] is [" ", "{", indent(body), hardline, "}", ""] */
  const bodyBlock = result[2];
  if (!Array.isArray(bodyBlock) || bodyBlock.length < 3) return;

  const bodyIndent = bodyBlock[2];
  if (!isCommand(bodyIndent, "indent")) return;

  /* When the selector group breaks (wraps), add one more indentation level. */
  bodyBlock[2] = builders.ifBreak(builders.indent(bodyIndent), bodyIndent, {
    groupId,
  });
}

function prettierPluginLessPrinter(
  path: AstPath<AnyNode>,
  options: ParserOptions,
  print: Print,
): builders.Doc {
  const node = path.node;

  /* Issue 1: Normalize indentation inside detached ruleset mixin arguments.
   *
   * At print time the postcss printer has parsed node.params into a
   * selector-class node whose value contains the full mixin class string
   * including the ({...}) block. We normalize its indentation in-place. */
  if (node.type === "css-atrule" && node.mixin === true) {
    const classNode = node.selector?.nodes?.[0]?.nodes?.[0];
    if (classNode?.type === "selector-class") {
      classNode.value = normalizeDetachedRulesetInValue(
        classNode.value,
        options.tabWidth,
        options.useTabs ?? false,
      );
    }
  }

  /* Issue 2: Fix `when` guard — join `when` with its condition before printing
   * so they can never be split across lines. */
  let hasWhenGuard = false;
  if (
    node.type === "css-rule" &&
    node.selector &&
    typeof node.selector === "object" &&
    node.selector.nodes
  ) {
    hasWhenGuard = fixWhenGuardInSelectorAst(node.selector.nodes);
  }

  const result = printers.postcss.print(path, options, print);

  /* Issue 2 (continued): Add extra body indentation when the selector wraps. */
  if (hasWhenGuard) {
    addWhenGuardBodyIndent(result);
  }

  if (node.type === "value-comma_group" && node.groups.length >= 2) {
    const [firstNode, secondNode] = node.groups;

    if (
      firstNode.type === "value-func" &&
      secondNode.type === "value-word" &&
      secondNode.value.startsWith("[") &&
      isCommand(result, "group") &&
      isCommand(result.contents, "indent") &&
      isCommand(result.contents.contents, "fill")
    ) {
      const parts = result.contents.contents.parts;
      /* Remove the spaces between the mixin function and "[]". */
      result.contents.contents.parts = parts.map((part) =>
        isCommand(part, "line") ? "" : part,
      );
    }
  }
  return result;
}

function isCommand<TType extends builders.DocCommand["type"]>(
  doc: builders.Doc,
  type: TType,
): doc is Extract<builders.DocCommand, { type: TType }> {
  return typeof doc === "object" && !Array.isArray(doc) && doc.type === type;
}

const prettierPluginLess = {
  parsers: {
    less: {
      ...parsers.less,
      astFormat: AST_FORMAT,
    },
  },
  printers: {
    [AST_FORMAT]: {
      ...printers.postcss,
      print: prettierPluginLessPrinter,
    },
  },
};

module.exports = prettierPluginLess;
