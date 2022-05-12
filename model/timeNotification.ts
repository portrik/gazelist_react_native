export class TimeNotification {
  id: string;
  time: Date;
  task: string;

  recurring?: boolean;

  constructor(id: string, time: Date, task: string, recurring?: boolean) {
    this.id = id;
    this.time = time;
    this.task = task;
    this.recurring = recurring;
  }

  static fromJson(raw: Record<string, any>): TimeNotification {
    return new TimeNotification(
      raw['id'],
      new Date(raw['time']),
      raw['task'],
      raw['recurring'],
    );
  }
}
