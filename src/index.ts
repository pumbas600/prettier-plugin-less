import { parsers, printers } from "prettier/plugins/postcss";
import { AstPath, ParserOptions, Plugin, Printer } from "prettier";
import { AnyNode, ValueNode } from "./types/nodes";
import { builders } from "prettier/doc";

const AST_FORMAT = "prettier-plugin-less-ast";

type Print = (path: AstPath<AnyNode>) => builders.Doc;

function findEndBracketNodeIndex(
  nodes: ValueNode[],
  { startingIndex = 0 },
): number {
  let index = startingIndex;
  for (const node of nodes) {
    if (node.value && node.value.endsWith("]")) {
      return index;
    }

    index++;
  }

  return -1;
}

function prettierPluginLessPrinter(
  path: AstPath<AnyNode>,
  options: ParserOptions,
  print: Print,
): builders.Doc {
  const result = printers.postcss.print(path, options, print);

  const node = path.node;

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
      /* Remove the spaces between ".mixin()" and "[]" */
      result.contents.contents.parts = parts.map((part) =>
        isCommand(part, "line") ? builders.softline : part,
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

const prettierPluginLess: Plugin = {
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
