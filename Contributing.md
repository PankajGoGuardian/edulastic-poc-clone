# Contribution Guide

---

This is a guide on how to make PR's to this repo. Please read through and try to stick to the guide before making a PR.

### PULL REQUEST(PR) GUIDE GUIDE 🚀

---

Before making a PR, make sure that a PR contains only a single (☝️) feature, fix etc - make that unrelated bug-fix (🔨) a different PR, please! A PR can have multiple commits, but divide them logically - no random commits! And while making commits, do remember to follow the commit message guide right below this. Also squash any merge commits - interactive rebasing maybe? `rebase -i`.

Finally, before making a PR make sure that your branch is rebased with the latest commits in the mainline (dev branch).

## Commit Message Guide ✉️

---

Each commit message should include a **type**, a **scope** and a **subject**:

```
 <type>(<scope>): <subject>
```

Lines should not exceed 100 characters. This allows the message to be easier to read on github as well as in various git tools and produces a nice, neat commit log.

e.g:

```
 #271 feat(standard): add style config and refactor to match
 #270 fix(config): only override publicPath when served by webpack
 #269 feat(eslint-config-defaults): replace eslint-config-airbnb
 #268 feat(config): allow user to configure webpack stats output
```

NOTE: Issue numbers are automatically appended to commits when if the branch name contains it.

#### Type

Must be one of the following:

- **build**: commit that triggers a build or related to build env
- **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation 😵
- **feat**: A new feature 👍
- **perf**: Changes related to performance enhancement ⚡
- **fix**: A bug fix 🔨
- **docs**: Documentation only changes 📖
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc) 💅
- **refactor**: A code change that neither fixes a bug or adds a feature 🔧
- **revert**: Reverts a specific commit already done 🔧
- **style**: Changes done for UI specifically 💅
- **test**: Adding tests to cover our code path ✔️

#### Scope

The scope is optional and could be among the following. Most are self explanatory & should fall under atleast one of these.

- **build**
- **arch**: Architecture
- **ui**:
- **design**:
- **poc**: poc repo impacted, eg. A PR can have poc,api to convey it impacts both.
- **api**: api repo impacted
- **client**: client side impacted
- **server**: server side impacted
- **data**:
- **patch**:

#### Subject

The subject contains succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize first letter
- no dot (.) at the end

---

> **Always make a PR as if the guy who ends up reviewing your code is be a violent psychopath who knows where you live.**
