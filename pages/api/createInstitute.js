import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://dev_admin:dev_admin@cluster0.wtpkorv.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri);
async function connect() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connect();



export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { instituteName, location, distance, studentsNumber, eiin, typeId, upazilaId } = req.body;

      const db = client.db('test');
      const collection = db.collection('Institute'); // Specify the collection name

      const newInstitute = {
        name: instituteName,
        location,
        distance,
        institutesNum: parseInt(studentsNumber),
        eiin,
        typeId,
        upazilaId,
      };

      const result = await collection.insertOne(newInstitute);

      res.status(201).json(result.ops[0]);

    } catch (error) {
      console.error('Error creating institute:', error);
      res.status(500).json({ error: 'An error occurred while creating the institute.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed.' });
  }
}
