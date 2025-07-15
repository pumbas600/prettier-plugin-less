import * as prettier from "prettier";
import prettierPluginLess from "../src/index";
import { describe, expect, test } from "vitest";

describe("prettierPluginLess", () => {
  const formatWithPlugin = async (code: string): Promise<string> => {
    return await prettier.format(code, {
      parser: "less",
      plugins: [prettierPluginLess],
    });
  };

  test("returns code without adding space between mixin and []", async () => {
    const code = [
      ".my-class {",
      "  font-size: .mixin-double(16px)[];",
      "}",
      "",
    ].join("\n");

    const formattedCode = await formatWithPlugin(code);
    expect(formattedCode).toBe(code);
  });

  test("returns code with space between mixin and [] removed", async () => {
    const code = [
      ".my-class {",
      "  font-size: .mixin-double(16px) [];",
      "}",
      "",
    ].join("\n");

    const expectedCode = [
      ".my-class {",
      "  font-size: .mixin-double(16px)[];",
      "}",
      "",
    ].join("\n");

    const formattedCode = await formatWithPlugin(code);
    expect(formattedCode).toBe(expectedCode);
  });

  test("return code without adding space between mixin without parameters and []", async () => {
    const code = [
      ".my-class {",
      "  font-size: .mixin-double()[];",
      "}",
      "",
    ].join("\n");

    const formattedCode = await formatWithPlugin(code);
    expect(formattedCode).toBe(code);
  });

  test("returns code with space between mixin without parameters and [] removed", async () => {
    const code = [
      ".my-class {",
      "  font-size: .mixin-double() [];",
      "}",
      "",
    ].join("\n");

    const expectedCode = [
      ".my-class {",
      "  font-size: .mixin-double()[];",
      "}",
      "",
    ].join("\n");

    const formattedCode = await formatWithPlugin(code);
    expect(formattedCode).toBe(expectedCode);
  });

  test("returns code without adding space between mixing and [@return]", async () => {
    const code = [
      ".my-class {",
      "  font-size: .mixin-double(16px)[@return];",
      "}",
      "",
    ].join("\n");

    const formattedCode = await formatWithPlugin(code);
    expect(formattedCode).toBe(code);
  });
});
