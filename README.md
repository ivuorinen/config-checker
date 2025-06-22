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
  console.log(
    "commitlint-config: If you want to create a new config file, please remove the existing one.",
  );
  console.log(`commitlint-config: Found config files at: ${foundConfig.join(", ")}`);
  process.exit(0);
}
```

### Locations scanned

| Searched configuration files        |
| ----------------------------------- |
| `[module name]`                     |
| `[module name]`rc                   |
| `[module name]`rc.json              |
| `[module name]`rc.yaml              |
| `[module name]`rc.yml               |
| `[module name]`rc.js                |
| `[module name]`rc.ts                |
| `[module name]`rc.mjs               |
| `[module name]`rc.cjs               |
| `[module name]`.jsonc               |
| `[module name]`.yaml                |
| `[module name]`.json                |
| `[module name]`.config.js           |
| `[module name]`.config.ts           |
| `[module name]`.config.mjs          |
| `[module name]`.config.cjs          |
| .`[module name]`                    |
| .`[module name]`rc                  |
| .`[module name]`rc.json             |
| .`[module name]`rc.yaml             |
| .`[module name]`rc.yml              |
| .`[module name]`rc.js               |
| .`[module name]`rc.ts               |
| .`[module name]`rc.mjs              |
| .`[module name]`rc.cjs              |
| .`[module name]`.jsonc              |
| .`[module name]`.yaml               |
| .`[module name]`.json               |
| .`[module name]`.config.js          |
| .`[module name]`.config.ts          |
| .`[module name]`.config.mjs         |
| .`[module name]`.config.cjs         |
| .config/`[module name]`             |
| .config/`[module name]`rc           |
| .config/`[module name]`rc.json      |
| .config/`[module name]`rc.yaml      |
| .config/`[module name]`rc.yml       |
| .config/`[module name]`rc.js        |
| .config/`[module name]`rc.ts        |
| .config/`[module name]`rc.mjs       |
| .config/`[module name]`rc.cjs       |
| .config/`[module name]`.jsonc       |
| .config/`[module name]`.yaml        |
| .config/`[module name]`.json        |
| .config/`[module name]`.config.js   |
| .config/`[module name]`.config.ts   |
| .config/`[module name]`.config.mjs  |
| .config/`[module name]`.config.cjs  |
| .config/.`[module name]`            |
| .config/.`[module name]`rc          |
| .config/.`[module name]`rc.json     |
| .config/.`[module name]`rc.yaml     |
| .config/.`[module name]`rc.yml      |
| .config/.`[module name]`rc.js       |
| .config/.`[module name]`rc.ts       |
| .config/.`[module name]`rc.mjs      |
| .config/.`[module name]`rc.cjs      |
| .config/.`[module name]`.jsonc      |
| .config/.`[module name]`.yaml       |
| .config/.`[module name]`.json       |
| .config/.`[module name]`.config.js  |
| .config/.`[module name]`.config.ts  |
| .config/.`[module name]`.config.mjs |
| .config/.`[module name]`.config.cjs |

This list has been generated using `npm run generate-table`.

## Contributing

If you are interested in helping contribute, please take a look at our [contribution guidelines][contributing-link] and open an [issue][issue-link] or [pull request][pull-request-link].

## Changelog

See [CHANGELOG][changelog-link] for a human-readable history of changes.

## License

This project is licensed under the MIT License - see the [LICENSE.md][license-link] file for details.

[changelog-link]: ./CHANGELOG.md
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
