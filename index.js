//@ts-check
const _ = require("lodash");
const ModularScale = require('modularscale-js');
const { Declaration, AtRule, Rule } = require("postcss");

module.exports = (opts) => {
  let options = {
    fontSize: 16,
    fontUnit: "px",
    ratio: 1.125, // If the ratio is an object, a "default" key is required
    scales: {
      "6": 6,
      "5": 5,
      "4": 4,
      "3": 3,
      "2": 2,
      "1": 1,
      "0": 0,
      "-1": -1,
    },
    ...opts,
  };

  options.default = { fontSize: options.fontSize, ratio: options.ratio };
  options = _.omit(options, ["fontSize", "ratio"]);

  // organize screens
  let screens = _.omit(options, ["fontUnit", "scales"]);
  screens = Object.keys(screens).map(key => ({ name: key, ...screens[key] }));
  screens = _.sortBy(screens, screen => +(_.get(screen, "min", "0").replace(/\D/g, '')));

  // set defaults
  screens = screens.map((screen, i, arr) => _.defaults(screen, arr[i - 1]));

  return {
    postcssPlugin: "postcss-responsive-fluid-modular-scale",
    AtRule: {
      ms: atRule => {
        const scale = options.scales[atRule.params];
        if (scale == null) {
          throw atRule.error("Modular scale key does not exist in the configuration.");
        }

        screens.forEach((screen, i, arr) => {
          const { fontSize, ratio } = screen;
          const min = +(_.get(screen, "min", "0").replace(/\D/g, ''));
          const msSize = ModularScale(scale, { base: fontSize, ratio });

          if (i === 0) {
            atRule.parent.append(new Declaration({ prop: "font-size", value: `${msSize}${options.fontUnit}` }));
          }
          else {
            let mediaRuleSelector = `screen and (min-width: ${min}px)`;
            let value = "";
            if (i < arr.length - 1) {
              const next = arr[i + 1];
              const max = next.min.replace(/\D/g, '') - 1;
              const msSizeMax = ModularScale(scale, { base: next.fontSize, ratio: next.ratio });

              mediaRuleSelector += ` and (max-width: ${max}px)`;
              value = `calc(${msSize}${options.fontUnit} + ${msSizeMax - msSize} * ((100vw - ${min}px)/${max - min}))`;
            }
            else {
              value = `${msSize}${options.fontUnit}`;
            }

            const parentRule = new Rule({ selector: atRule.parent.selector });
            parentRule.append(new Declaration({ prop: "font-size", value }));

            const mediaRule = new AtRule({ name: "media", params: mediaRuleSelector, nodes: [
              new Rule({ selector: atRule.parent.selector, nodes: [
                new Declaration({ prop: "font-size", value }),
              ] }),
            ]});
            atRule.root().append(mediaRule);
          }
        });

        atRule.remove();
      }
    }
  };
};

module.exports.postcss = true;