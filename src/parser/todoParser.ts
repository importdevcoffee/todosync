import * as vscode from "vscode";
import { Priority, TodoItem, Type } from "../types";

export function parseTodos(document: vscode.TextDocument): TodoItem[] {
  let lineCount = document.lineCount;
  const regex = /\s*\/\/\s*(TODO|FIXME|HACK)(\[(high|medium|low)\])?:\s*(.+)/;
  const todoItems: TodoItem[] = [];
  for (let i = 0; i < lineCount; i++) {
    const match = regex.exec(document.lineAt(i).text);
    if (!match) continue; //no TODO, FIXME or HACK Found.

    let type = match[1] as Type;
    let priority = match[3] as Priority | undefined;
    let message = match[4];
    todoItems.push({
      file: document.fileName,
      line: i + 1,
      message: message,
      synced: false,
      type: type,
      priority: priority,
    });
  }

  return todoItems;
}
