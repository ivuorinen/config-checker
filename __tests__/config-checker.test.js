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

console.info("configChecker tests passed");
