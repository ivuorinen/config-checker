# `@ivuorinen/config-checker` <!-- omit in toc -->

[![npm package][npm-badge]][npm-link] [![license MIT][license-badge]][license-link] [![ivuorinen's Code Style][style-badge]][style-link]

Check for existence of common configuration files in usually used locations.

## Installation

Install `this package` as a _`dependency`_:

```sh
# npm
npm install @ivuorinen/config-checker --save

# Yarn
yarn add @ivuorinen/config-checker
```

## Usage

This package is intended to be used in lifecycle events of other packages.

Configuration packages located in this repository use this tool to check for existence of configuration files, and if they exist, they will not create new ones.

### Real world example

For commitlint-config you can find the usage in the [commitlint-config postinstall.cjs][commitlint-postinstall-link] file.

Here's a snippet from the file:

```js
const process = require("process");
const checkConfig = require("@ivuorinen/config-checker");
const foundConfig = checkConfig("commitlint");

if (foundConfig.length > 0) {
  console.log("commitlint-config: Found existing commitlint config file, skipping creation.");
  console.log("commitlint-config: If you want to create a new config file, please remove the existing one.");
  console.log(`commitlint-config: Found config files at: ${foundConfig.join(", ")}`);
  process.exit(0);
}
```

### Locations scanned

<!-- BEGIN GENERATED CONFIG TABLE -->
| Searched configuration files                                                           |
| -------------------------------------------------------------------------------------- |
| `[module name]`                                                                        |
| `[module name]`rc                                                                      |
| `[module name]`rc.{json,jsonc,json5,yaml,yml,toml,js,cjs,mjs,ts,cts,mts}               |
| `[module name]`.{json,jsonc,json5,yaml,yml,toml}                                       |
| `[module name]`.config.{json,jsonc,json5,yaml,yml,toml,js,cjs,mjs,ts,cts,mts}          |
| .`[module name]`                                                                       |
| .`[module name]`rc                                                                     |
| .`[module name]`rc.{json,jsonc,json5,yaml,yml,toml,js,cjs,mjs,ts,cts,mts}              |
| .`[module name]`.{json,jsonc,json5,yaml,yml,toml}                                      |
| .`[module name]`.config.{json,jsonc,json5,yaml,yml,toml,js,cjs,mjs,ts,cts,mts}         |
| .config/`[module name]`                                                                |
| .config/`[module name]`rc                                                              |
| .config/`[module name]`rc.{json,jsonc,json5,yaml,yml,toml,js,cjs,mjs,ts,cts,mts}       |
| .config/`[module name]`.{json,jsonc,json5,yaml,yml,toml}                               |
| .config/`[module name]`.config.{json,jsonc,json5,yaml,yml,toml,js,cjs,mjs,ts,cts,mts}  |
| .config/.`[module name]`                                                               |
| .config/.`[module name]`rc                                                             |
| .config/.`[module name]`rc.{json,jsonc,json5,yaml,yml,toml,js,cjs,mjs,ts,cts,mts}      |
| .config/.`[module name]`.{json,jsonc,json5,yaml,yml,toml}                              |
| .config/.`[module name]`.config.{json,jsonc,json5,yaml,yml,toml,js,cjs,mjs,ts,cts,mts} |
<!-- END GENERATED CONFIG TABLE -->

This list is generated with `yarn generate-table`; do not edit the table by hand.

## Contributing

If you are interested in helping contribute, please take a look at our [contribution guidelines][contributing-link] and open an [issue][issue-link] or [pull request][pull-request-link].

## Changelog

See [CHANGELOG][changelog-link] for a human-readable history of changes.

## License

This project is licensed under the MIT License - see the [LICENSE.md][license-link] file for details.

[changelog-link]: https://github.com/ivuorinen/config-checker/releases
[contributing-link]: https://github.com/ivuorinen/.github/blob/main/CONTRIBUTING.md
[issue-link]: https://github.com/ivuorinen/config-checker/issues
[license-badge]: https://img.shields.io/github/license/ivuorinen/config-checker?style=flat-square&labelColor=292a44&color=663399
[license-link]: ./LICENSE.md
[npm-badge]: https://img.shields.io/npm/v/@ivuorinen/config-checker?style=flat-square&labelColor=292a44&color=663399
[npm-link]: https://www.npmjs.com/package/@ivuorinen/config-checker
[pull-request-link]: https://github.com/ivuorinen/config-checker/pulls
[style-badge]: https://img.shields.io/badge/code_style-ivuorinen%E2%80%99s-663399.svg?labelColor=292a44&style=flat-square
[style-link]: https://github.com/ivuorinen/config-checker
[commitlint-postinstall-link]: https://github.com/ivuorinen/base-configs-commitlint/scripts/postinstall.js
