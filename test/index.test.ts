import * as prettier from "prettier";
import * as prettierPluginLess from "../src/index";
import { describe, expect, test } from "vitest";

describe("prettierPluginLess", () => {
  const formatWithPlugin = async (
    code: string,
    options: prettier.Options = {},
  ): Promise<string> => {
    return await prettier.format(code, {
      parser: "less",
      plugins: [prettierPluginLess],
      ...options,
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

  test("normalizes 4-space indentation inside mixin detached ruleset argument", async () => {
    const code = [
      ".mixin-media-hover({",
      "    &:hover {",
      "        --example: 0.75;",
      "    }",
      "});",
      "",
    ].join("\n");

    const expectedCode = [
      ".mixin-media-hover({",
      "  &:hover {",
      "    --example: 0.75;",
      "  }",
      "});",
      "",
    ].join("\n");

    const formattedCode = await formatWithPlugin(code);
    expect(formattedCode).toBe(expectedCode);
  });

  test("converts spaces to tabs inside mixin detached ruleset argument when useTabs is true", async () => {
    const code = [
      ".mixin-media-hover({",
      "    &:hover {",
      "        --transition-duration: var(--timing-duration-in);",
      "    }",
      "});",
      "",
    ].join("\n");

    const expectedCode = [
      ".mixin-media-hover({",
      "\t&:hover {",
      "\t\t--transition-duration: var(--timing-duration-in);",
      "\t}",
      "});",
      "",
    ].join("\n");

    const formattedCode = await formatWithPlugin(code, { useTabs: true });
    expect(formattedCode).toBe(expectedCode);
  });

  test("normalizes 2-space indentation inside mixin detached ruleset argument to 4 spaces when tabWidth is 4", async () => {
    const code = [
      ".mixin-media-hover({",
      "  &:hover {",
      "    --transition-duration: var(--timing-duration-in);",
      "  }",
      "});",
      "",
    ].join("\n");

    const expectedCode = [
      ".mixin-media-hover({",
      "    &:hover {",
      "        --transition-duration: var(--timing-duration-in);",
      "    }",
      "});",
      "",
    ].join("\n");

    const formattedCode = await formatWithPlugin(code, { tabWidth: 4 });
    expect(formattedCode).toBe(expectedCode);
  });

  test("preserves correct 2-space indentation inside mixin detached ruleset argument", async () => {
    const code = [
      ".mixin-media-hover({",
      "  &:hover {",
      "    --example: 0.75;",
      "  }",
      "});",
      "",
    ].join("\n");

    const formattedCode = await formatWithPlugin(code);
    expect(formattedCode).toBe(code);
  });

  test("keeps when and condition on same line when selector fits on one line", async () => {
    const code = [
      ".mixin(@a) when (lightness(@a) >= 50%) {",
      "  font-size: 12px;",
      "}",
      "",
    ].join("\n");

    const formattedCode = await formatWithPlugin(code);
    expect(formattedCode).toBe(code);
  });

  test("joins when and condition when split across lines but fits on one line", async () => {
    const code = [
      ".mixin(@a)",
      "\twhen",
      "\t(lightness(@a) >= 50%) {",
      "\tfont-size: 12px;",
      "}",
      "",
    ].join("\n");

    const expectedCode = [
      ".mixin(@a) when (lightness(@a) >= 50%) {",
      "  font-size: 12px;",
      "}",
      "",
    ].join("\n");

    const formattedCode = await formatWithPlugin(code);
    expect(formattedCode).toBe(expectedCode);
  });

  test("keeps when and condition together and adds extra body indent when selector wraps", async () => {
    const code = [
      ".grid-column-count(@width-or-column-count)",
      "\twhen",
      "\t(ispixel(@width-or-column-count)) {",
      "\t@return: (@width-or-column-count / @grid-column-base-width);",
      "}",
      "",
    ].join("\n");

    const expectedCode = [
      ".grid-column-count(@width-or-column-count)",
      "  when (ispixel(@width-or-column-count)) {",
      "    @return: (@width-or-column-count / @grid-column-base-width);",
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
