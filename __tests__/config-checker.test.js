/* eslint no-console: "off" -- CLI app that gives users feedback */

const path = require("node:path");
const configChecker = require("..");
const assert = require("node:assert").strict;

const configs = configChecker("test", path.join(__dirname, "fixtures"));

/**
 * Checks if an array contains a file.
 * @param {string[]} c The array of configs to check.
 * @param {string} file The file to check for.
 * @returns {boolean} - True if the array contains the file.
 */
const arrayContains = (c = [], file = "") => c.includes(file);

assert.ok(arrayContains(configs, ".testrc"));
assert.ok(arrayContains(configs, ".config/testrc.ts"));
assert.ok(arrayContains(configs, "test.toml")); // newly covered data format

// A module with no matching files returns an empty list.
assert.deepStrictEqual(configChecker("does-not-exist", path.join(__dirname, "fixtures")), []);

// With no prefix and no INIT_CWD, it falls back to cwd instead of throwing.
delete process.env.INIT_CWD;
assert.doesNotThrow(() => configChecker("test"));

/**
 * Runs configChecker with DEBUG set and reports whether it printed anything.
 *
 * Every config package calls configChecker from postinstall, so whatever it
 * prints lands in the consumer's install log; this pins which DEBUG values
 * are allowed to put it there.
 * @param {string} value The DEBUG value to run with.
 * @returns {boolean} - True when the candidate list was printed.
 */
const printsWithDebug = (value) => {
  const original = console.log;
  let printed = false;

  process.env.DEBUG = value;
  console.log = () => {
    printed = true;
  };

  try {
    configChecker("test", path.join(__dirname, "fixtures"));
  } finally {
    console.log = original;
    delete process.env.DEBUG;
  }

  return printed;
};

// DEBUG enables the candidate list only when it names this package or `*`,
// the `debug` package's namespace convention, never for another namespace.
assert.strictEqual(printsWithDebug("config-checker"), true);
assert.strictEqual(printsWithDebug("express:*, config-checker"), true);
assert.strictEqual(printsWithDebug("*"), true);
assert.strictEqual(printsWithDebug("express:*"), false);
assert.strictEqual(printsWithDebug("1"), false);

console.info("configChecker tests passed");
