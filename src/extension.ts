import * as vscode from "vscode";
import { parseTodos } from "./parser/todoParser";
import { TodoTreeItem, TodoTreeProvider } from "./views/todoTreeView";
import { TodoItem } from "./types";
import { createIssue } from "./github/githubClient";

export function activate(context: vscode.ExtensionContext) {
  console.log("TodoSync is now active");

  //Create status bar item
  const statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100, //priority - higher = further left
  );
  statusBar.show();

  // Create provider (holds todo data)
  const provider = new TodoTreeProvider();

  // Register window with VS Code
  vscode.window.registerTreeDataProvider("todosync.todoView", provider);

  //Register open command - receives a TodoItem and opens file at correct line
  const openTodo = vscode.commands.registerCommand(
    "todosync.openTodo",
    async (todoItem: TodoItem) => {
      // Build URI from filepath
      const uri = vscode.Uri.file(todoItem.file);
      // Open document and jump to the line
      await vscode.window.showTextDocument(uri, {
        selection: new vscode.Range(todoItem.line - 1, 0, todoItem.line - 1, 0),
      });
    },
  );

  const openIssueCommand = vscode.commands.registerCommand(
    "todosync.openIssue",
    async (item: TodoTreeItem) => {
      const key = `${item.todoitem.file}:${item.todoitem.message}`;
      const urls = context.globalState.get<Record<string, string>>("todosync.issueUrls") ?? {};
      const url = urls[key];

      if (url) {
        vscode.env.openExternal(vscode.Uri.parse(url));
      } else {
        vscode.window.showWarningMessage("TodoSync: No linked issue found for this TODO");
      }
    },
  );

  const createIssueCommand = vscode.commands.registerCommand(
    "todosync.createIssue",
    async (item: TodoTreeItem) => {
      //check if already synced
      if (item.todoitem.synced) {
        // ask user for confirmation, as the todoitem is already synced
        const confirm = await vscode.window.showWarningMessage(
          "This TODO has already been pushed to GitHub. Create another issue?",
          "Yes",
          "No",
        );
        if (confirm !== "Yes") return;
      }

      // argument received automatically via context menu for createIssue
      // vscode passes the clicked tree item directly to context menu commands.
      const issueUrl = await createIssue(item.todoitem);

      if (issueUrl) {
        // build key for uniquely identifying this todoitem
        const key = `${item.todoitem.file}:${item.todoitem.message}`;

        // get existing synced keys from globalState and add new one
        const synced = context.globalState.get<string[]>("todosync.synced") ?? [];
        await context.globalState.update("todosync.synced", [...synced, key]);

        // storing GitHub Issue URL mapped to this key
        // used later by openIssueCommand to open the linked issue
        const urls = context.globalState.get<Record<string, string>>("todosync.issueUrls") ?? {};
        urls[key] = issueUrl;
        await context.globalState.update("todosync.issueUrls", urls);

        // refresh tree to show synced indicator
        await scanAndRefresh();
      }
    },
  );

  // Scan the current open file and feed results into provider
  async function scanAndRefresh() {
    const syncedKeys = context.globalState.get<string[]>("todosync.synced") ?? [];

    // read config for contribution files, changeable in settings.json
    const config = vscode.workspace.getConfiguration("todosync");
    const fileTypes = config.get<string[]>("fileTypes") ?? ["ts", "js", "py", "cs"];
    const glob = `**/*.{${fileTypes.join(",")}}`;

    const files = await vscode.workspace.findFiles(glob, "**/node_modules/**");
    // open each file and parse it
    const allTodos = [];
    for (const file of files) {
      const doc = await vscode.workspace.openTextDocument(file);
      allTodos.push(...parseTodos(doc, syncedKeys));
    }
    updateStatusBar(allTodos, statusBar);
    provider.refresh(allTodos);
  }

  // Scan once on startup
  scanAndRefresh();

  // Re-scan whenever the document is edited
  const onDocChange = vscode.workspace.onDidChangeTextDocument(scanAndRefresh);

  const todoRefresh = vscode.commands.registerCommand("todosync.refreshTodos", async () => {
    await scanAndRefresh();
  });

  // Register everything for cleanup on deactivation
  context.subscriptions.push(
    statusBar,
    openTodo,
    openIssueCommand,
    createIssueCommand,
    onDocChange,
    todoRefresh,
  );
}

export function deactivate() {}

function updateStatusBar(todos: TodoItem[], statusBar: vscode.StatusBarItem) {
  const total = todos.length;
  const synced = todos.filter((t) => t.synced).length;
  statusBar.text = `$(bookmark) ${total} TODOs (${synced} synced)`; // $(bookmark) syntax uses VSCode built-in icons
  statusBar.tooltip = "Click to focus TodoSync panel";
  statusBar.command = "workbench.view.extension.todosync";
}
