import * as vscode from "vscode";
import { parseTodos } from "./parser/todoParser";
import { TodoTreeProvider } from "./views/todoTreeView";

export function activate(context: vscode.ExtensionContext) {
  console.log("TodoSync is now active");

  // Create provider (holds todo data)
  const provider = new TodoTreeProvider();

  // Register it with VS Code - "todosync.todoView"
  vscode.window.registerTreeDataProvider("todosync.todoView", provider);

  // 3. Scan the current open file and feed results into provider
  function scanAndRefresh() {
    const doc = vscode.window.activeTextEditor?.document;
    if (doc) {
      provider.refresh(parseTodos(doc));
    }
  }

  //TODO: some message

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
