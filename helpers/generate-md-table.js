/* eslint no-console: "off", n/no-process-exit: "off" -- CLI helper */

const fs = require("node:fs");
const path = require("node:path");
const process = require("node:process");
const { patterns } = require("../lib/configuration-paths");

const README = path.join(__dirname, "..", "README.md");
const BEGIN = "<!-- BEGIN GENERATED CONFIG TABLE -->";
const END = "<!-- END GENERATED CONFIG TABLE -->";

const header = "Searched configuration files";
const rows = patterns("`[module name]`");
const width = Math.max(header.length, ...rows.map((row) => row.length));
const pad = (cell) => `| ${cell}${" ".repeat(width - cell.length)} |`;

const table = [pad(header), `| ${"-".repeat(width)} |`, ...rows.map(pad)].join("\n");
const block = `${BEGIN}\n${table}\n${END}`;

const readme = fs.readFileSync(README, "utf8");
const marker = new RegExp(`${BEGIN}[\\s\\S]*${END}`);
if (!marker.test(readme)) {
  console.error(`Markers not found in README.md. Add a block delimited by:\n${BEGIN}\n${END}`);
  process.exit(1);
}
const updated = readme.replace(marker, block);

if (process.argv.includes("--check")) {
  if (updated !== readme) {
    console.error("README.md config table is out of date. Run `yarn generate-table`.");
    process.exit(1);
  }
  console.log("README.md config table is up to date.");
} else if (updated === readme) {
  console.log("README.md config table already up to date.");
} else {
  fs.writeFileSync(README, updated);
  console.log("README.md config table updated.");
}
