import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongod = MongoMemoryServer.create();

export const connect = async () => {
  const uri = await (await mongod).getUri();
  await mongoose.connect(uri);
};

export const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await (await mongod).stop();
};

export const clearDatabase = () => {
  const { collections } = mongoose.connection;
  Object.keys(collections).forEach(async (key) => {
    const collection = collections[key];
    await collection.deleteMany({});
  });
};
