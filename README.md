# prettier-plugin-less

A plugin that makes some opinionated changes to Prettier’s formatting of Less files.

### Features

- Tries really hard to prevent any spaces between a mixin and a `[...]`:
  ```less
  .my-class {
    font-size: .mixin-double(32px)[];
  }
  ```
