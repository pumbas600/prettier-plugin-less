import { Printer } from "prettier";

/*
 * It's not exported for some reason, but we can see it in the JS and their source code:
 * https://github.com/prettier/prettier/blob/main/src/language-css/index.js
 */
declare module "prettier/plugins/postcss" {
  declare const printers: {
    postcss: Printer;
  };
}
