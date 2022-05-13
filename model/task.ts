export class Task {
  id: string;
  title: string;
  owner: string;
  finished: boolean;

  attachments: Record<string, boolean>;
  lists: Record<string, boolean>;

  content?: string;
  locationNotification?: string;
  timeNotification?: Date;
  recurringTimeNotification?: boolean;

  constructor(
    id: string,
    title: string,
    owner: string,
    finished: boolean,
    attachments: Record<string, boolean>,
    lists: Record<string, boolean>,
    content?: string,
    locationNotification?: string,
    timeNotification?: Date,
    recurringTimeNotification?: boolean,
  ) {
    this.id = id;
    this.title = title;
    this.owner = owner;
    this.finished = finished;
    this.attachments = attachments;
    this.lists = lists;
    this.content = content;
    this.locationNotification = locationNotification;
    this.timeNotification = timeNotification;
    this.recurringTimeNotification = recurringTimeNotification;
  }

  static fromJson(raw: Record<string, any>): Task {
    return new Task(
      raw['id'],
      raw['title'],
      raw['owner'],
      raw['finished'],
      raw['attachments'],
      raw['lists'],
      raw['content'],
      raw['locationNotification'],
      new Date(raw['timeNotification']),
      raw['recurringTimeNotification'],
    );
  }
}
