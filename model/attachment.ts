export class Attachment {
  id: string;
  resourceId: string;

  task: string;

  constructor(id: string, resourceId: string, task: string) {
    this.id = id;
    this.resourceId = resourceId;
    this.task = task;
  }

  static fromJson(raw: Record<string, any>): Attachment {
    return new Attachment(raw['id'], raw['resourceId'], raw['task']);
  }
}
