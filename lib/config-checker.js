/* eslint no-console: "off", n/no-process-exit: "off" -- CLI app that gives users feedback */

const fs = require("node:fs");
const path = require("node:path");
// noinspection NpmUsedModulesInstalled
const process = require("node:process");
const configurationPaths = require("./configuration-paths");

/**
 * Whether DEBUG asks for this package's diagnostic output.
 *
 * DEBUG is the shared switch of the `debug` package, so a plain truthiness
 * check printed the candidate list for `DEBUG=express:*` or any other
 * namespace, into the install output of every package that calls this from
 * postinstall. Follow the same comma-separated convention instead: only this
 * package's name or `*` enables it.
 * @returns {boolean} - True when DEBUG names config-checker or `*`.
 */
const debugEnabled = () =>
  (process.env.DEBUG ?? "").split(",").some((name) => ["config-checker", "*"].includes(name.trim()));

/**
 * Checks for the existence of a configuration file.
 * @param {string} moduleName The name of the module to check for.
 * @param {string} pathPrefix The prefix to add to the path.
 * @returns {string[]} - The paths to the configuration files.
 */
const configChecker = (moduleName, pathPrefix = "") => {
  // INIT_CWD is only set by npm/yarn during lifecycle scripts; fall back to
  // cwd so direct/programmatic calls don't throw on an undefined path.
  const searchPath = pathPrefix || process.env.INIT_CWD || process.cwd();

  const allFiles = configurationPaths(moduleName);

  if (debugEnabled()) {
    const filesWithPath = allFiles.map((file) => path.join(searchPath, file));
    console.log(filesWithPath);
  }

  // Look for config files in defined search path, and return found.
  return allFiles.filter((file) => fs.existsSync(path.join(searchPath, file)));
};

module.exports = configChecker;
