import * as vscode from "vscode";
import * as path from "path";
import { TodoItem } from "../types";

class FileTreeItem extends vscode.TreeItem {
  constructor(
    public readonly filepath: string,
    public readonly todoItems: TodoItem[],
  ) {
    super(
      path.basename(filepath), // label for treeItem - just filename
      vscode.TreeItemCollapsibleState.Collapsed, // has children (TodoItems)
    );
  }
}

class TodoTreeItem extends vscode.TreeItem {
  constructor(public readonly todoitem: TodoItem) {
    super(
      `[${todoitem.type}] ${todoitem.message}`,
      vscode.TreeItemCollapsibleState.None,
    );
    this.description = todoitem.priority ?? "";
    const iconMap: Record<string, string> = {
      TODO: "bookmark",
      FIXME: "bug",
      HACK: "warning",
    };
    this.iconPath = new vscode.ThemeIcon(iconMap[todoitem.type] ?? "bookmark");
    this.command = {
      command: "todosync.openTodo",
      title: "Open TODO",
      arguments: [todoitem], //passes the TodoItem to the command
    };
  }
}

type TreeNode = FileTreeItem | TodoTreeItem;

export class TodoTreeProvider implements vscode.TreeDataProvider<TreeNode> {
  private todos: TodoItem[] = []; // starts empty

  //Create EvenetEmitter
  private _onDidChangeTreeData = new vscode.EventEmitter<void>();
  //Expose it as an Event
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  constructor() {}

  getTreeItem(element: TreeNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(element?: TreeNode): vscode.ProviderResult<TreeNode[]> {
    if (!element) {
      const grouped = new Map<string, TodoItem[]>();
      for (const todo of this.todos) {
        if (!grouped.has(todo.file)) {
          grouped.set(todo.file, []); //Explain please
        }
        grouped.get(todo.file)!.push(todo); // string doesnt have .push (this doesnt work.), explain what to do
      }
      // Map needs to be converted to an array first, we get something like:
      // [["extension.ts", [todo1, todo2]], ["example.ts", [todo3]]]
      return Array.from(grouped.entries()).map(
        ([file, todos]) => new FileTreeItem(file, todos),
      );
    }
    if (element instanceof FileTreeItem) {
      return element.todoItems.map((todo) => new TodoTreeItem(todo));
    }
    return [];
  }

  refresh(todos: TodoItem[]): void {
    this.todos = todos;
    this._onDidChangeTreeData.fire(); // Will trigger re-render
  }
}
