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
    const code = `
    .my-class {
      font-size: .mixin-double(16px)[];
    }
    `;

    const formattedCode = await formatWithPlugin(code);
    expect(formattedCode).toBe(code);
  });
});
