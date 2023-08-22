import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { id } = req.query; // Get the institute ID from the query parameter
    const { name, location, institutesNum, eiin, distance } = req.body;

    try {
      const uri = 'mongodb+srv://dev_admin:dev_admin@cluster0.wtpkorv.mongodb.net/?retryWrites=true&w=majority';
      const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      await client.connect();

      const db = client.db('test');

      await db.collection('institutes').updateOne(
        { _id: ObjectId(id) }, // Convert the ID to ObjectId
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
      console.error('Error editing institute:', error);
      res.status(500).json({ error: 'An error occurred while editing institute.' });
    } finally {
      client.close();
    }
  } else {
    res.status(405).json({ error: 'Method not allowed.' });
  }
}
