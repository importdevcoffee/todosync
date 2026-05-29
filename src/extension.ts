import * as vscode from "vscode";
import { parseTodos } from "./parser/todoParser";
import { TodoTreeProvider } from "./views/todoTreeView";

export function activate(context: vscode.ExtensionContext) {
  console.log("TodoSync is now active");

  // Create provider (holds todo data)
  const provider = new TodoTreeProvider();

  // Register it with VS Code - "todosync.todoView"
  vscode.window.registerTreeDataProvider("todosync.todoView", provider);

  // Scan the current open file and feed results into provider
  async function scanAndRefresh() {
    // find all files
    const files = await vscode.workspace.findFiles(
      "**/*.{ts, js, py, cs}",
      "**/node_modules/**",
    );
    // open each file and parse it
    const allTodos = [];
    for (const file of files) {
      const doc = await vscode.workspace.openTextDocument(file);
      const todos = parseTodos(doc);
      allTodos.push(...todos); // instead of [[todo1, todo2], [todo3]], we get a flat array [todo1, todo2, todo3, ...]
    }
    provider.refresh(allTodos);
  }

  // Scan once on startup
  scanAndRefresh();

  // Re-scan whenever the active editor changes
  const onEditorChange =
    vscode.window.onDidChangeActiveTextEditor(scanAndRefresh);

  // Re-scan whenever the document is edited
  const onDocChange = vscode.workspace.onDidChangeTextDocument(scanAndRefresh);

  // Register everything for cleanup on deactivation
  context.subscriptions.push(onEditorChange, onDocChange);
}

export function deactivate() {}
