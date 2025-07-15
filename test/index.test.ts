import * as prettier from "prettier";
import prettierPluginLess from "../src/index";
import { describe, expect, test } from "vitest";

const code = `
.mixin-double(@value) {
  @return: (@value * 2);
}

.my-class {
  font-size: .mixin-double(16px)[];
}
`;

describe("prettierPluginLess", () => {
  test("returns code without adding space between mixin and []", async () => {
    const formattedCode = await prettier.format(code, {
      parser: "less",
      plugins: [prettierPluginLess],
    });

    expect(formattedCode).toBe(code);
  });
});
