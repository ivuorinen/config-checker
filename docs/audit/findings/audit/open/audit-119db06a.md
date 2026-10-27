---
id: audit-119db06a
auditor: audit
severity: low
category: maintainability
area: lib/config-checker.js
status: open
found: 2026-10-27
location: lib/config-checker.js:15-29
location_sha: d6c6c4e47343834f
---

# Seven postinstall copies of this logic have drifted

## Problem

Every config package's `scripts/postinstall.cjs` re-implements the same steps around `configChecker`: resolve
`INIT_CWD`, skip on an existing config, write with `{ flag: "wx" }`, degrade errors to a message. They now differ in
structure, logging (`console.log` vs `console.warn`), exit handling and whether the file ends with a newline.

## Evidence

Seven scripts, 37-82 lines each. Only base-configs-stylelint appends `\n` and only base-configs-eslint's template ends
with one; the other five write without it (filed in each repo). stylelint alone skips transitive installs.

## Impact

A fix to the shared behaviour has to be made seven times and released seven times; the newline defect is what that costs.

## Fix

Export `writeStarterConfig(tool, fileName, contents)` from config-checker (detect, `wx`-write `contents` with a
guaranteed final newline, report, never throw) and reduce each postinstall to a call; stylelint keeps its
transitive-install guard in front of it. This is a refactor across eight packages, so do it after the dependency
branches land.

## Status — partially applied (2026-10-27)

`writeStarterConfig(moduleName, fileName, contents, pathPrefix)` is added on
config-checker `fix/audit-2026-10` (dc8b6c5, `feat`, so it releases a minor),
with tests for written / found / race / failed and a README section. The
seven postinstall scripts cannot call it until that release is on npm; until
then each package fixes its missing final newline in place on its own
`fix/audit-2026-10` branch. Remaining: migrate the seven postinstalls to
`writeStarterConfig` and raise their `@ivuorinen/config-checker` floor to the
release that ships it.
