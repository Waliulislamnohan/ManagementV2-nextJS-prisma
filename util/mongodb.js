// util/mongodb.js
import { MongoClient } from 'mongodb';

let cachedClient = null;

export async function connectToDatabase() {
  if (cachedClient) {
    return { db: cachedClient.db() };
  }

  const client = new MongoClient(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  if (!client.isConnected()) {
    await client.connect();
    cachedClient = client;
  }

  return { db: client.db() };
}
