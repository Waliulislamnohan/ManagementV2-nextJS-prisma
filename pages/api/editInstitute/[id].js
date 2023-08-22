import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { id } = req.query; // Get the institute ID from the URL parameter
    const { name, location, institutesNum, eiin, distance } = req.body;

    let client;

    try {
      const uri = 'mongodb+srv://dev_admin:dev_admin@cluster0.wtpkorv.mongodb.net/?retryWrites=true&w=majority';
      client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      await client.connect();

      const db = client.db('test');

      await db.collection('institutes').updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            name,
            location,
            institutesNum,
            eiin,
            distance,
          },
        }
      );

      res.status(200).json({ message: 'Institute updated successfully.' });
    } catch (error) {
      console.error('Error updating institute:', error);
      res.status(500).json({ error: 'An error occurred while updating the institute.' });
    } finally {
      if (client) {
        await client.close();
      }
    }
  } else {
    res.status(405).json({ error: 'Method not allowed.' });
  }
}
