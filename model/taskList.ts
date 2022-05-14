export class TaskList {
  id: string;
  title: string;
  owner: string;

  tasks: Record<string, boolean>;
  users: Record<string, boolean>;

  constructor(
    id: string,
    title: string,
    owner: string,
    tasks: Record<string, boolean>,
    users: Record<string, boolean>,
  ) {
    this.id = id;
    this.title = title;
    this.owner = owner;
    this.tasks = tasks;
    this.users = users;
  }

  toJson(): Record<string, any> {
    return {
      id: this.id,
      title: this.title,
      owner: this.owner,
      tasks: { ...this.tasks },
      users: { ...this.users },
    };
  }

  static fromJson(raw: Record<string, any>): TaskList {
    return new TaskList(
      raw['id'],
      raw['title'],
      raw['owner'],
      raw['tasks'],
      raw['users'],
    );
  }
}
