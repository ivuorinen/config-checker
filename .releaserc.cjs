"use strict";

module.exports = {
  branches: ["main"],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
        releaseRules: [
          { breaking: true, type: "chore", scope: "deps", release: "minor" },
          { type: "chore", scope: "deps", release: "patch" },
          { type: "chore", scope: "actions", release: false },
        ],
      },
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
        presetConfig: {
          types: [
            { type: "feat", section: "Features" },
            { type: "fix", section: "Bug Fixes" },
            { type: "perf", section: "Performance" },
            { type: "revert", section: "Reverts" },
            { type: "chore", section: "Maintenance" },
            { type: "docs", hidden: true },
            { type: "style", hidden: true },
            { type: "refactor", hidden: true },
            { type: "test", hidden: true },
            { type: "build", hidden: true },
            { type: "ci", hidden: true },
          ],
        },
      },
    ],
    "@semantic-release/npm",
    "@semantic-release/github",
  ],
};
