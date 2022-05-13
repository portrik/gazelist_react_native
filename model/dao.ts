import database from '@react-native-firebase/database';

export class DAO {
  path: string;

  constructor(path: string) {
    this.path = path;
  }

  async create(object: Record<string, any>) {
    await database()
      .ref(`${this.path}/${object['id']}`)
      .set({ ...object });
  }

  async update(object: Record<string, any>) {
    await database()
      .ref(`${this.path}/${object['id']}`)
      .update({ ...object });
  }

  async remove(object: Record<string, any>) {
    await database().ref(`${this.path}/${object['id']}`).remove();
  }

  getQuery() {
    return database().ref(this.path);
  }

  async getNewId(): Promise<string> {
    return database().ref(this.path).push().key ?? '0';
  }
}
