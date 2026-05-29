// The module 'vscode' contains the VS Code extensibility API
import * as vscode from "vscode";
import { parseTodos } from "./parser/todoParser";

export function activate(context: vscode.ExtensionContext) {
  // console to output diagnostic information (console.log) and errors (console.error)
  console.log("TodoSync is now active");

  const disposable = vscode.commands.registerCommand(
    "todosync.helloWorld",
    () => {
      // code will be executed every time the command is executed
      // Display message box to the user
      vscode.window.showInformationMessage("Hello World from todosync!");
      const doc = vscode.window.activeTextEditor?.document;
      if (doc) {
        console.log(parseTodos(doc));
      }
    },
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
