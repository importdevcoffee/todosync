# Changelog

All notable changes to TodoSync will be documented here.
Format based on [Keep a Changelog](http://keepachangelog.com/)

## [Unreleased]

## [0.1.0] - 2026-06-03

### Added

- Initial extension scaffold and project structure
- TODO parser with regex-based extraction of type, priority and message
- Support for TODO, FIXME, HACK annotations
- Optional priority metadata via bracket syntax e.g. `TODO[high]`
- Support for both `//` and `#` comment styles (JS/TS and Python)
- Sidebar tree view with TODOs grouped by file
- Icons per annotation type (TODO → bookmark, FIXME → bug, HACK → warning)
- Priority displayed as description on each TODO item
- Click a TODO in the sidebar to jump directly to the file and line
- Workspace-wide TODO scanning across `.ts`, `.js`, `.py` and `.cs` files
- Create GitHub Issues from TODO items via right-click context menu
- Issue body includes type, priority, relative file path and line number
- GitHub authentication via VS Code built-in session
- Synced status tracking with visual indicator in sidebar
- Duplicate issue prevention with confirmation dialog
- Status bar showing total and synced TODO count
- Manual refresh button in sidebar title bar
- Extension icon

## [0.1.1] - 2026-06-04

### Fixed

- Marketplace image rendering with absolute URLs
- README overview section cleaned up
