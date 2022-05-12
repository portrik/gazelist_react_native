export class Task {
  id: string;
  title: string;
  owner: string;

  content?: string;
  locationNotification?: string;
  timeNotifications?: string;

  attachments: Record<string, boolean>;
  lists: Record<string, boolean>;

  constructor(
    id: string,
    title: string,
    owner: string,
    attachments: Record<string, boolean>,
    lists: Record<string, boolean>,
    content?: string,
    locationNotification?: string,
    timeNotification?: string,
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.owner = owner;
    this.locationNotification = locationNotification;
    this.timeNotifications = timeNotification;
    this.attachments = attachments;
    this.lists = lists;
  }

  static fromJson(raw: Record<string, any>): Task {
    return new Task(
      raw['id'],
      raw['title'],
      raw['owner'],
      raw['content'],
      raw['locationNotification'],
      raw['timeNotification'],
      raw['attachments'],
      raw['lists'],
    );
  }
}
