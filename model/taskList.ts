export class TaskList {
  id: string;
  title: string;

  tasks: Record<string, boolean>;
  users: Record<string, boolean>;

  constructor(
    id: string,
    title: string,
    tasks: Record<string, boolean>,
    users: Record<string, boolean>,
  ) {
    this.id = id;
    this.title = title;
    this.tasks = tasks;
    this.users = users;
  }

  static fromJson(raw: Record<string, any>): TaskList {
    return new TaskList(raw['id'], raw['title'], raw['tasks'], raw['users']);
  }
}
