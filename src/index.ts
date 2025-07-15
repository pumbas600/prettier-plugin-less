import { parsers, printers } from "prettier/plugins/postcss";
import { AstPath, Doc, ParserOptions, Plugin, Printer } from "prettier";

const AST_FORMAT = "prettier-plugin-less-ast";

type Print = (path: AstPath) => Doc;

function findEndBracketNodeIndex(nodes: any[], { startingIndex = 0 }): number {
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
  path: AstPath,
  options: ParserOptions,
  print: Print
): Doc {
  const node = path.node;

  if (node.type === "value-comma_group" && node.groups.length >= 2) {
    const [firstNode, secondNode] = node.groups;

    if (
      firstNode.type === "value-func" &&
      secondNode.type === "value-word" &&
      secondNode.value.startsWith("[")
    ) {
      const endBracketNodeIndex = findEndBracketNodeIndex(node.groups, {
        startingIndex: 1,
      });

      if (endBracketNodeIndex !== -1) {
        const printedNodes = path.map(print, "groups");
        const parts = printedNodes.slice(0, endBracketNodeIndex + 1);

        return {
          type: "group",
          contents: {
            type: "fill",
            parts,
          },
          break: false,
          expandedStates: [],
        };
      }
    }
  }

  return printers.postcss.print(path, options, print);
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

export default prettierPluginLess;
