export enum Type {
  Todo = "TODO",
  Fixme = "FIXME",
  Hack = "HACK",
}

export enum Priority {
  High = "high",
  Medium = "medium",
  Low = "low",
}

enum Label {
  Bug = "bug",
  Doc = "doc",
  Feature = "feature",
}

export interface TodoItem {
  type: Type;
  priority?: Priority;
  label?: Label;
  message: string;
  line: number;
  file: string; // file path
  synced: boolean; // e.g. pushed to Github?
}
