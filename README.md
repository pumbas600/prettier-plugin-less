# prettier-plugin-less

A Prettier plugin that just removes the space between a
[mixin function](https://lesscss.org/features/#mixins-feature-mixins-as-functions-feature) and its
property accessor (`[...]`). Yup, that’s it.

### Example

**Without plugin**

```less
.my-class {
  font-size: .rem(16px) [];
}
```

**With plugin**

```less
.my-class {
  font-size: .rem(16px)[];
}
```
