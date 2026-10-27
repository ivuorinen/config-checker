/* eslint no-console: "off" -- CLI app that gives users feedback */

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const configChecker = require("..");
const assert = require("node:assert").strict;

const { writeStarterConfig } = configChecker;

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

const roots = [];

/**
 * Creates a temp directory standing in for a consumer's project root.
 * @returns {string} - The directory; removed when the file finishes.
 */
const tempRoot = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "config-checker-"));
  roots.push(root);
  return root;
};

try {
  // Writes the starter file and adds the final newline the contents lack.
  const root = tempRoot();
  const written = writeStarterConfig("starter", ".starterrc.json", '{"extends":"x"}', root);
  assert.strictEqual(written.status, "written");
  assert.strictEqual(written.filePath, path.join(root, ".starterrc.json"));
  assert.strictEqual(fs.readFileSync(written.filePath, "utf8"), '{"extends":"x"}\n');

  // Contents that already end with a newline are not given a second one.
  const withNewline = tempRoot();
  writeStarterConfig("starter", ".starterrc", "extends x\n", withNewline);
  assert.strictEqual(fs.readFileSync(path.join(withNewline, ".starterrc"), "utf8"), "extends x\n");

  // An existing config is reported and left untouched.
  const again = writeStarterConfig("starter", ".starterrc.json", "{}", root);
  assert.strictEqual(again.status, "found");
  assert.deepStrictEqual(again.found, [".starterrc.json"]);
  assert.strictEqual(fs.readFileSync(written.filePath, "utf8"), '{"extends":"x"}\n');

  // A file the detection does not cover but that occupies fileName (the race
  // `wx` exists for) is reported as found, never overwritten.
  const occupied = tempRoot();
  fs.writeFileSync(path.join(occupied, "starter.custom"), "mine");
  const raced = writeStarterConfig("starter", "starter.custom", "theirs", occupied);
  assert.strictEqual(raced.status, "found");
  assert.strictEqual(fs.readFileSync(path.join(occupied, "starter.custom"), "utf8"), "mine");

  // An unwritable root is returned as a failure instead of thrown. A regular
  // file stands in for the root: ENOTDIR comes from path resolution, so it
  // holds for root too, where a 0555 directory would still be writable.
  const notADirectory = path.join(tempRoot(), "not-a-directory");
  fs.writeFileSync(notADirectory, "");
  const failed = writeStarterConfig("starter", ".starterrc.json", "{}", notADirectory);
  assert.strictEqual(failed.status, "failed");
  assert.strictEqual(failed.error.code, "ENOTDIR");
} finally {
  roots.forEach((root) => fs.rmSync(root, { recursive: true, force: true }));
}

console.info("configChecker tests passed");
