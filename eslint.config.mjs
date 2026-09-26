import { createRequire } from "node:module";

// Vendored from @ivuorinen/eslint-config (base-configs-eslint) to break a
// dependency cycle: that package depends on @ivuorinen/config-checker (this
// repo). ESLint v10 flat config uses native ESM resolution that does not honor
// NODE_PATH, so a bare `import` of these plugins fails under MegaLinter's
// bundled install; createRequire resolves them from the local node_modules.
//
// Kept in step with base-configs-eslint/index.cjs by hand. The one deliberate
// difference: upstream ignores `lib/`, but here `lib/` is the source code, so it
// stays linted.
const require = createRequire(import.meta.url);
const globals = require("globals");
const configEslint = require("eslint-config-eslint");
const configPrettier = require("eslint-config-prettier");
const pluginJs = require("@eslint/js");

export default [
  ...configEslint,
  {
    linterOptions: {
      reportUnusedDisableDirectives: "warn",
    },
    rules: {
      "func-style": [
        "error",
        "declaration",
        {
          allowArrowFunctions: true,
        },
      ],
    },
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...globals.es2021,
        ...globals.node,
      },
      // No ecmaVersion override: flat config defaults to "latest". Pinning an
      // older version turns newer syntax (class private fields, top-level
      // await) into a fatal parse error, which runs no rules on the file.
    },
  },
  pluginJs.configs.recommended,
  configPrettier,
  {
    ignores: ["coverage/", "dist/", "node_modules/"],
  },
];
