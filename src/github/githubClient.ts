import * as vscode from "vscode";
import { TodoItem } from "../types";
import path from "path";

interface RepoInfo {
  owner: string;
  repo: string;
  root: string; // workspace root
}

// Get the GitHub auth session (or prompt login)
async function getSession(): Promise<vscode.AuthenticationSession | undefined> {
  const session = await vscode.authentication.getSession("github", ["repo"], {
    createIfNone: true,
  });
  if (!session) {
    vscode.window.showErrorMessage("TodoSync: Please sign in to GitHub first");
    return;
  }
  return session;
}

// Get owner and repo from the workspace git remote
async function getRepoInfo(): Promise<RepoInfo | undefined> {
  const gitExtension = vscode.extensions.getExtension("vscode.git")?.exports;
  if (!gitExtension) {
    vscode.window.showErrorMessage("TodoSync: Git extension not found");
    return undefined;
  }
  const git = gitExtension.getAPI(1);
  const remoteUrl = git.repositories[0]?.state.remotes[0]?.fetchUrl;

  if (!remoteUrl) {
    vscode.window.showErrorMessage("TodoSync: No remote URL found");
    return undefined;
  }

  const match = remoteUrl.match(/(https:\/\/|git@)?github\.com[\/:]([^\/]+)\/([^\/]+)(\.git)?$/);
  if (!match) return undefined; // not a GitHub remote

  const owner = match[2];
  const repo = match[3].replace(".git", ""); // safety net in case .git slips through

  const root = git?.repositories[0]?.rootUri?.fsPath;
  if (!root) {
    vscode.window.showErrorMessage("TodoSync: No workspace folder open");
    return undefined;
  }

  return { owner, repo, root };
}

// Create GitHub issue
export async function createIssue(todo: TodoItem): Promise<string | null> {
  const repoInfo = await getRepoInfo();
  if (!repoInfo) return null;

  const session = await getSession();
  if (!session) return null;
  const token = session.accessToken;

  const url = `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/issues`;

  const relativePath = path.relative(repoInfo.root, todo.file);

  const title = todo.message;
  const body = `## ${todo.message}

**Type:** ${todo.type}
**Priority:** ${todo.priority ?? "none"}
**File:** ${relativePath}
**Line:** ${todo.line}

---
*Created by TodoSync*`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, body }),
  });

  if (!response.ok) {
    vscode.window.showErrorMessage(`TodoSync: Failed to create issue — ${response.statusText}`);
    return null;
  }

  const data = (await response.json()) as { html_url: string };
  vscode.window.showInformationMessage(`TodoSync: Issue created successfully`);

  return data.html_url;
}
