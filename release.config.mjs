/** @type {import('semantic-release').GlobalConfig} */
export default {
  branches: ["main", "release"],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
        releaseRules: [
          { type: "feat", release: "minor" },
          { type: "fix", release: "patch" },
          { type: "chore", scope: "deps", release: "patch" },
          { type: "chore", scope: "deps-dev", release: "patch" },
          { type: "perf", release: "patch" },
          { type: "revert", release: "patch" },
          { type: "docs", scope: "readme", release: "patch" },
          { type: "style", release: "patch" },
          { type: "refactor", release: "patch" },
          { type: "test", release: "patch" },
          { type: "build", release: "patch" },
          { type: "ci", release: "patch" },
          { breaking: true, release: "major" },
          { scope: "no-release", release: false },
        ],
        parserOpts: {
          noteKeywords: ["BREAKING CHANGE", "BREAKING CHANGES"],
        },
      },
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
        presetConfig: {
          types: [
            { type: "feat", section: "✨ Features" },
            { type: "fix", section: "🐛 Bug Fixes" },
            { type: "chore", scope: "deps", section: "🧹 Dependencies" },
            { type: "chore", scope: "deps-dev", section: "🧹 Dependencies" },
            { type: "perf", section: "🚀 Performance Improvements" },
            { type: "revert", section: "⏪ Reverts" },
            { type: "docs", section: "📚 Documentation" },
            { type: "style", section: "🎨 Styles" },
            { type: "refactor", section: "🔧 Code Refactoring" },
            { type: "test", section: "✅ Tests" },
            { type: "build", section: "🏗️ Build System" },
            { type: "ci", section: "🤖 Continuous Integration" },
          ],
        },
      },
    ],
    "@semantic-release/changelog",
    "@semantic-release/npm",
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md", "package.json"],
        message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
    "@semantic-release/github",
  ],
};
