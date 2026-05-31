# TodoSync

A VS Code extension that syncs your code annotations to GitHub Issues.

## Features

- Scans your entire workspace for TODO, FIXME and HACK annotations
- Sidebar panel listing all TODOs grouped by file
- Click any TODO to jump directly to the file and line
- Right-click any TODO to create a GitHub Issue instantly
- Supports priority metadata via bracket syntax e.g. `TODO[high]`
- Icons per annotation type (TODO → bookmark, FIXME → bug, HACK → warning)
- Azure DevOps support (planned)

## Requirements

- VS Code 1.100.0 or higher
- A GitHub account (authentication handled via VS Code built-in GitHub login)

## Usage

1. Open a workspace in VS Code
2. Click the TodoSync icon in the activity bar
3. All TODOs in your workspace appear in the sidebar
4. Click a TODO to jump to it in the editor
5. Right-click a TODO and select **Create GitHub Issue**

## Release Notes

See [CHANGELOG.md](CHANGELOG.md) for full release history.

## Status

🚧 Under active development