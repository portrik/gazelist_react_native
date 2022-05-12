export class LocationNotification {
  id: string;
  location: string;
  task: string;

  radius?: number;

  constructor(id: string, location: string, task: string, radius?: number) {
    this.id = id;
    this.location = location;
    this.task = task;
    this.radius = radius;
  }

  static fromJson(raw: Record<string, any>): LocationNotification {
    return new LocationNotification(
      raw['id'],
      raw['location'],
      raw['task'],
      raw['radius'],
    );
  }
}
