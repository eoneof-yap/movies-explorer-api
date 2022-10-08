import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

class VirtualMongoDb {
  static _database;

  constructor() {
    const dbUrl = process.env.DB_URL;
    if (dbUrl) {
      mongoose.connect(dbUrl);
    }
  }

  static getInstance = () => {
    if (this._database) {
      return this._database;
    }
    this._database = new VirtualMongoDb();
    return this._database;
  };
}

export default VirtualMongoDb;
