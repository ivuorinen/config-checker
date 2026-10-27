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

/**
 * Creates a starter config file for a module unless the project already has one.
 *
 * Meant for postinstall scripts, which run inside the consumer's install: a
 * throw there fails that whole install, so every outcome is returned for the
 * caller to report instead of thrown. The file is opened with the `wx` flag, so
 * a config that appears between the check and the write (concurrent installs
 * share a project root) is reported as found rather than overwritten. The
 * contents always end with a newline, because the seven packages that wrote
 * these files by hand mostly omitted it and the consumer's EditorConfig and
 * formatter checks then failed on a file they never wrote.
 * @param {string} moduleName The module whose configuration files to look for.
 * @param {string} fileName The file to create in the project root.
 * @param {string} contents The file contents; a final newline is added when missing.
 * @param {string} pathPrefix The project root; defaults to INIT_CWD, then the cwd.
 * @returns {{status: "found"|"written"|"failed", found: string[], filePath: string, error?: Error}}
 *   - `found` lists the existing config files, `error` is set only on "failed".
 */
const writeStarterConfig = (moduleName, fileName, contents, pathPrefix = "") => {
  const root = pathPrefix || process.env.INIT_CWD || process.cwd();
  const filePath = path.join(root, fileName);
  const found = configChecker(moduleName, root);

  if (found.length > 0) {
    return { status: "found", found, filePath };
  }

  try {
    fs.writeFileSync(filePath, contents.endsWith("\n") ? contents : `${contents}\n`, { flag: "wx" });
    return { status: "written", found, filePath };
  } catch (error) {
    // EEXIST is the race the flag guards against: another install wrote it first.
    if (error.code === "EEXIST") {
      return { status: "found", found: [fileName], filePath };
    }

    return { status: "failed", found, filePath, error };
  }
};

module.exports = configChecker;
module.exports.writeStarterConfig = writeStarterConfig;
