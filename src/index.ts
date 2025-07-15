import { parsers, printers } from "prettier/plugins/postcss";
import { AstPath, Doc, ParserOptions, Plugin, Printer } from "prettier";

const AST_FORMAT = "prettier-plugin-less-ast";

type Print = (path: AstPath) => Doc;

function prettierPluginLessPrinter(
  path: AstPath,
  options: ParserOptions,
  print: Print
): Doc {
  const node = path.node;

  if (node.type === "value-comma_group" && node.groups.length === 2) {
    const [firstNode, secondNode] = node.groups;

    if (
      firstNode.type === "value-func" &&
      secondNode.type === "value-word" &&
      secondNode.value.startsWith("[")
    ) {
      /*
       * Unfortunately we can't just call `print(firstNode), print(SecondNode)`... Something else
       * is going on too...
       */
      const printedNodes = path.map(print, "groups");

      return {
        type: "group",
        contents: {
          type: "fill",
          parts: printedNodes,
        },
        break: false,
        expandedStates: [],
      };
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
