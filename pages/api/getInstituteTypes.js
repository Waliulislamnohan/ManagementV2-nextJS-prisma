import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  const mongoUrl = process.env.DB_URL;
  const dbName = process.env.DB_NAME;
  if (req.method === 'GET') {
    let client; // Declare the client variable

    try {
        const uri = mongoUrl;
      client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      await client.connect();

      const db = client.db(dbName); // Replace with your database name
      const institutes = await db.collection('institutes').find().toArray();

      // Extract unique institute types from the institutes
      const uniqueInstituteTypes = [...new Set(institutes.map(institute => institute.type))];

      res.status(200).json(uniqueInstituteTypes);
    } catch (error) {
      console.error('Error fetching institute types:', error);
      res.status(500).json({ error: 'An error occurred while fetching institute types.' });
    } finally {
      if (client) {
        await client.close();
      }
    }
  } else {
    res.status(405).json({ error: 'Method not allowed.' });
  }
}
