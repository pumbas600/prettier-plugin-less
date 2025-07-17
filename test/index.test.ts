import * as prettier from "prettier";
import * as prettierPluginLess from "../src/index";
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

  test("returns code without adding space between mixin and [@return]", async () => {
    const code = [
      ".my-class {",
      "  font-size: .mixin-double(16px)[@return];",
      "}",
      "",
    ].join("\n");

    const formattedCode = await formatWithPlugin(code);
    expect(formattedCode).toBe(code);
  });

  test("returns code with space between mixin, [@return] removed", async () => {
    const code = [
      ".my-class {",
      "  font-size: .mixin-double(16px) [@return];",
      "}",
      "",
    ].join("\n");

    const expectedCode = [
      ".my-class {",
      "  font-size: .mixin-double(16px)[@return];",
      "}",
      "",
    ].join("\n");

    const formattedCode = await formatWithPlugin(code);
    expect(formattedCode).toBe(expectedCode);
  });

  test("returns code with spaces between mixin, [ ... ] and @return removed", async () => {
    const code = [
      ".my-class {",
      "  font-size: .mixin-double(16px) [ @return ];",
      "}",
      "",
    ].join("\n");

    const expectedCode = [
      ".my-class {",
      "  font-size: .mixin-double(16px)[@return];",
      "}",
      "",
    ].join("\n");

    const formattedCode = await formatWithPlugin(code);
    expect(formattedCode).toBe(expectedCode);
  });

  test("returns code with spaces between mixin, [ ... ] and long variable removed", async () => {
    const code = [
      ".my-class {",
      "  font-size: .mixin-double(16px) [ @reallyreallyreallyreallyreallylongvariablename ];",
      "}",
      "",
    ].join("\n");

    const expectedCode = [
      ".my-class {",
      "  font-size: .mixin-double(16px)[@reallyreallyreallyreallyreallylongvariablename];",
      "}",
      "",
    ].join("\n");

    const formattedCode = await formatWithPlugin(code);
    expect(formattedCode).toBe(expectedCode);
  });

  test("returns code with spaces between long mixin, [ ... ] and long variable removed", async () => {
    const code = [
      ".my-class {",
      "  font-size: .mixin-really-long-name-for-a-double(16px) [ @reallyreallyreallyreallyreallylongvariablename ];",
      "}",
      "",
    ].join("\n");

    const expectedCode = [
      ".my-class {",
      "  font-size: .mixin-really-long-name-for-a-double(16px)[@reallyreallyreallyreallyreallylongvariablename];",
      "}",
      "",
    ].join("\n");

    const formattedCode = await formatWithPlugin(code);
    expect(formattedCode).toBe(expectedCode);
  });

  test("returns code with spaces between mixin and nested [ ... ] removed", async () => {
    const code = [
      ".my-class {",
      "  font-size: .mixin-double(16px) [@variableone [ variabletwo ]];",
      "}",
      "",
    ].join("\n");

    const expectedCode = [
      ".my-class {",
      "  font-size: .mixin-double(16px)[@variableone[variabletwo]];",
      "}",
      "",
    ].join("\n");

    const formattedCode = await formatWithPlugin(code);
    expect(formattedCode).toBe(expectedCode);
  });
});
