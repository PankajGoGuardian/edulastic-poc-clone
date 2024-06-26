module.exports = {
  rules: {
    "body-leading-blank": [1, "always"],
    "footer-leading-blank": [1, "always"],
    "header-max-length": [2, "always", 100],
    "scope-enum": [
      2,
      "always",
      ["build", "arch", "ui", "design", "poc", "api", "client", "server", "data", "patch", "evaluator"]
    ],
    "scope-case": [2, "always", "lowerCase"],
    "subject-empty": [2, "never"],
    "type-case": [2, "always", "lowerCase"],
    "type-empty": [2, "never"],
    "type-enum": [
      2,
      "always",
      ["build", "chore", "ci", "docs", "feat", "fix", "perf", "refactor", "revert", "style", "test"]
    ]
  }
};
