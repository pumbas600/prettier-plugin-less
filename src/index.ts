import { parsers, printers } from "prettier/plugins/postcss";
import { Plugin } from "prettier";

const AST_FORMAT = "prettier-plugin-less-ast";

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
      print: (...args) => {
        return printers.postcss.print(...args);
      },
    },
  },
};

export default prettierPluginLess;
