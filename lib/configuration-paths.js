const path = require("node:path");

/**
 * Returns an array of configuration paths.
 * @param {string} moduleName The name of the module to check for.
 * @returns {string[]} - The paths to the configuration files.
 */
const configurationPaths = (moduleName) => {
  const filesPlain = [
    moduleName,
    `${moduleName}rc`,
    `${moduleName}rc.json`,
    `${moduleName}rc.yaml`,
    `${moduleName}rc.yml`,
    `${moduleName}rc.js`,
    `${moduleName}rc.ts`,
    `${moduleName}rc.mjs`,
    `${moduleName}rc.cjs`,
    `${moduleName}.jsonc`,
    `${moduleName}.yaml`,
    `${moduleName}.json`,
    `${moduleName}.config.js`,
    `${moduleName}.config.ts`,
    `${moduleName}.config.mjs`,
    `${moduleName}.config.cjs`,
  ];

  const filesDot = filesPlain.map((file) => `.${file}`);
  const bothFiles = filesPlain.concat(filesDot);
  const filesInConfig = bothFiles.map((file) => path.join(".config", file));

  return bothFiles.concat(filesInConfig);
};

module.exports = configurationPaths;
