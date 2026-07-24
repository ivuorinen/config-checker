const path = require("node:path");

// Single source of truth for the config filenames we detect. Each group is a
// stem plus the extensions that may follow it: a group with no extensions is a
// single literal name; a group with extensions expands to one name per
// extension at runtime and renders as brace-expansion in the generated table.
const groups = [
  { stem: "", exts: [] }, //         [module name]
  { stem: "rc", exts: [] }, //       [module name]rc
  { stem: "rc.", exts: ["json", "yaml", "yml", "js", "ts", "mjs", "cjs"] },
  { stem: ".", exts: ["jsonc", "yaml", "json"] },
  { stem: ".config.", exts: ["js", "ts", "mjs", "cjs"] },
];

/**
 * Multiplies each base name into its dotfile and .config/ variants.
 * @param {string[]} bases The base file names.
 * @returns {string[]} - Every base plus its `.`-prefixed and `.config/` forms.
 */
const expand = (bases) => {
  const both = bases.concat(bases.map((file) => `.${file}`));
  return both.concat(both.map((file) => path.join(".config", file)));
};

/**
 * Returns an array of configuration paths.
 * @param {string} moduleName The name of the module to check for.
 * @returns {string[]} - The paths to the configuration files.
 */
const configurationPaths = (moduleName) =>
  expand(
    groups.flatMap(({ stem, exts }) =>
      exts.length === 0 ? [`${moduleName}${stem}`] : exts.map((ext) => `${moduleName}${stem}${ext}`),
    ),
  );

/**
 * Returns the same paths as {@link configurationPaths}, but with the varying
 * extensions collapsed into brace-expansion groups for display, e.g.
 * `foo.{jsonc,yaml,json}`. Used to generate the README table.
 * @param {string} moduleName The name of the module to check for.
 * @returns {string[]} - The collapsed configuration path patterns.
 */
const configurationPatterns = (moduleName) =>
  expand(
    groups.map(({ stem, exts }) =>
      exts.length === 0 ? `${moduleName}${stem}` : `${moduleName}${stem}{${exts.join(",")}}`,
    ),
  );

module.exports = configurationPaths;
module.exports.patterns = configurationPatterns;
