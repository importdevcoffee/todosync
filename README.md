# TodoSync

Sync your TODO annotations to GitHub Issues directly from VS Code.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.120.0+-blue?logo=visualstudiocode)](https://marketplace.visualstudio.com/items?itemName=importdevcoffee.todosync)

---

## Overview

TodoSync scans your workspace for `TODO`, `FIXME` and `HACK` annotations and lets you push them directly to GitHub Issues without leaving VS Code. Track what's synced, jump to any annotation in one click, and keep your code and issue tracker in sync.

Built as a side project by a computer science student — feedback and contributions welcome.

---

## Demo

### Sidebar & Tree View

![Sidebar and Tree View](resources/demo/sidebar_and_treeview.gif)

### Creating GitHub Issues

![Creating GitHub Issues](resources/demo/create_issues.gif)

![GitHub Issue Example](resources/demo/github_issues_by_todosync.png)

### Status Bar

![Status Bar](resources/demo/status_bar.gif)

---

## Features

- Scans your entire workspace for `TODO`, `FIXME` and `HACK` annotations
- Sidebar panel listing all TODOs grouped by file
- Click any TODO to jump directly to the file and line
- Right-click any TODO to create a GitHub Issue instantly
- Priority metadata support via `TODO[high]`, `TODO[medium]`, `TODO[low]`
- Visual sync indicator showing which TODOs have already been pushed
- Status bar showing total and synced TODO count
- Manual refresh button in the sidebar

---

## Annotation Syntax

```ts
// TODO: basic annotation
// TODO[high]: high priority task
// TODO[medium]: medium priority task
// TODO[low]: low priority task
// FIXME: something that needs fixing
// HACK: temporary workaround
```

Parsed automatically across `.ts`, `.js`, `.py` and `.cs` files in your workspace.

---

## Requirements

- VS Code 1.120.0 or higher
- A GitHub account — authentication handled via VS Code built-in GitHub login

---

## Usage

1. Open a workspace in VS Code
2. Click the TodoSync icon in the activity bar
3. All TODOs appear in the sidebar grouped by file
4. Click a TODO to jump to it in the editor
5. Right-click a TODO and select **Create GitHub Issue**
6. The TODO is marked as synced — no duplicate issues will be created

---

## How It Works

TodoSync uses VS Code's built-in GitHub authentication — no Personal Access Token setup required. On first use you will be prompted to sign in to GitHub. Your repository owner and name are detected automatically from your workspace git remote.

---

## Roadmap

- [ ] Azure DevOps support
- [ ] Label management
- [ ] Editor decorations for TODO lines
- [ ] Multi-root workspace support

---

## Contributing

Found a bug or want to suggest a feature? PRs and issues are welcome.

[Report a Bug](https://github.com/importdevcoffee/todosync/issues) · [Request a Feature](https://github.com/importdevcoffee/todosync/issues) · [Changelog](CHANGELOG.md)

---

## License

MIT © [manamasu](https://github.com/manamasu)