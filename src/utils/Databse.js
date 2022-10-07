import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

class Database {
  static _database;

  constructor() {
    const dbUrl = process.env.DB_URL;
    if (dbUrl) {
      mongoose.connect(dbUrl)
        .then(() => console.log('Connected with database'))
        .catch(() => console.log('Not connected with                                      database'));
    }
  }

  static getInstance() {
    if (this._database) {
      return this._database;
    }
    this._database = new Database();
    return this._database;
  }
}
export default Database;
