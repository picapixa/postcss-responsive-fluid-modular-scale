# PostCSS Responsive Fluid Modular Scale

[PostCSS] plugin that applies responsive, fluid font-sizes that uses the modular scale.

This uses [modularscale-js] to create a ramp of font-sizes that adds fluid typography between breakpoints, ensuring responsiveness. 

For more information on how it is possible, [check out the article by Mike Riethmuller on responsive typography](https://www.madebymike.com.au/writing/precise-control-responsive-typography/#heading-precise-control-with-calc()), where we use `calc()` to automatically resize the font-size depending on the viewport width.

**NOTE: This requires PostCSS 8+.**

[modularscale-js]: https://github.com/modularscale/modularscale-js
[PostCSS]: https://github.com/postcss/postcss

In _`postcss.config.js`_:

```diff
module.exports = {
  plugins: [
+   require('postcss-responsive-fluid-modular-scale')({
+     fontSize: 18px
+   }),
  ]
}
```

Input CSS:

```css
.foo {
    /* Input example */
    @ms 0;
}
```

Output:

```css
.foo {
  /* Output example */
  font-size: 16px;
}
```

## Usage

**Step 1:** Install plugin:

```sh
npm install --save-dev postcss postcss-responsive-fluid-modular-scale
```

**Step 2:** Check your project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

**Step 3:** Add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-responsive-fluid-modular-scale')({
+      fontSize: 18px
+    }),
    require('autoprefixer')
  ]
}
```

## Options

### `fontSize`

Set the base font size. Tied with `fontUnit`.

Defaults to `16`. 

### `fontUnit`

Sets the global font units to set. You can't change this at the per-breakpoint level.

Defaults to `"px"`.

### `ratio`

Sets the ratio to determine the scaling of the font sizes, according to [modularscale](https://www.modularscale.com/).

Defaults to `1.125`.

### `scales`

Sets the ramp of the font sizing, represented by a map of the scale keys with their corresponding number values.

The scale value aligns with the font size set at a given breakpoint. For example, by default, adding `@ms 0` as a CSS rule declaration returns `font-size: 16px`, while `@ms 1` returns `font-size: 18px`, and so on.

Default values:

```json
{
  "6": 6,
  "5": 5,
  "4": 4,
  "3": 3,
  "2": 2,
  "1": 1,
  "0": 0,
  "-1": -1,
}
```

### Adding breakpoints

If you wish, you may choose to have different parameters set at certain breakpoints, like:

```diff
module.exports = {
  plugins: [
+   require('postcss-responsive-fluid-modular-scale')({
+     "screen-sm-min": {
+       ratio: 1.2,
+     },
+     "screen-lg-min": {
+       fontSize: 1.25,
+     }
+   }),
  ]
}
```

You may use any breakpoint name except _`default`_, as that is reserved for the default values you set from `fontSize`, `fontUnit`, and `ratio`.

You cannot change the `fontUnit` and `scales` value per-breakpoint. The default values will be used instead.

## Dependencies

It uses [modularscale-js], [lodash], and [postcss] to make this happen. Thank you!

[lodash]: https://github.com/lodash/lodash
[official docs]: https://github.com/postcss/postcss#usage
