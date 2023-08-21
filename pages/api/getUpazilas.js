import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    let client; // Declare the client variable

    try {
        const uri = 'mongodb+srv://dev_admin:dev_admin@cluster0.wtpkorv.mongodb.net/?retryWrites=true&w=majority'; // Replace with your MongoDB URI // Replace with your MongoDB URI
      client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      await client.connect();

      const db = client.db('test'); // Replace with your database name
      const institutes = await db.collection('institutes').find().toArray();

      // Extract unique upazila names from the institutes
      const uniqueUpazilas = [...new Set(institutes.map(institute => institute.upazila))];

      res.status(200).json(uniqueUpazilas);
    } catch (error) {
      console.error('Error fetching upazilas:', error);
      res.status(500).json({ error: 'An error occurred while fetching upazilas.' });
    } finally {
      if (client) {
        await client.close();
      }
    }
  } else {
    res.status(405).json({ error: 'Method not allowed.' });
  }
}
