export class User {
  id: string;
  username: string;

  constructor(id: string, username: string) {
    this.id = id;
    this.username = username;
  }

  static fromJson(raw: Record<string, string>): User {
    return new User(raw['id'], raw['username']);
  }
}
