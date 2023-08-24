// pages/api/deleteInstitute/[id].js
import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const mongoUrl = process.env.DB_URL;
  const dbName = process.env.DB_NAME;
  if (req.method === 'DELETE') {
    const instituteId = req.query.id;
    let client; // Declare the client variable here

    try {
      const uri =  mongoUrl;
      client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      await client.connect();

      const db = client.db(dbName); // Replace with your database name
      const collection = db.collection('institutes');

      const deleteResult = await collection.deleteOne({ _id: new ObjectId(instituteId) });

      if (deleteResult.deletedCount === 1) {
        res.status(200).json({ message: 'Institute deleted successfully.' });
      } else {
        res.status(404).json({ error: 'Institute not found.' });
      }
    } catch (error) {
      console.error('Error deleting institute:', error);
      res.status(500).json({ error: 'An error occurred while deleting the institute.' });
    } finally {
      if (client) {
        await client.close();
      }
    }
  } else {
    res.status(405).json({ error: 'Method not allowed.' });
  }
}
