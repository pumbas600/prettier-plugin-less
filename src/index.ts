import { printers } from "prettier/plugins/postcss";
import { Options, Plugin } from "prettier/";

const options: Options = {};

const prettierPluginLess: Plugin = {
  printers: {
    postcss: {
      ...printers.postcss,
      print: (...args) => {
        return printers.postcss.print(...args);
      },
    },
  },
};

export default prettierPluginLess;
