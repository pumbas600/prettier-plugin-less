# prettier-plugin-less

A Prettier plugin that just removes the space between a
[mixin function](https://lesscss.org/features/#mixins-feature-mixins-as-functions-feature) and its
property selector (`[...]`). Yup, that’s it.

### Example

```less
.my-class {
  font-size: .mixin-double(16px)[];
}
```
