import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const {
      instituteName,
      location,
      distance,
      studentsNumber,
      eiin,
      upazilaName,
      instituteType,
    } = req.body;

    try {
      const uri = 'mongodb+srv://dev_admin:dev_admin@cluster0.wtpkorv.mongodb.net/?retryWrites=true&w=majority';
      const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

      await client.connect();
      const db = client.db('test');
      const instituteCollection = db.collection('institutes');

      const newInstitute = {
        name: instituteName,
        location,
        distance,
        institutesNum: studentsNumber,
        eiin,
        upazila: upazilaName,
        type: instituteType,
      };

      const result = await instituteCollection.insertOne(newInstitute);

      client.close();

      res.status(200).json('Data inserted Successfully');
    } catch (error) {
      console.error('Error creating institute:', error);
      res.status(500).json({ error: 'An error occurred while creating the institute.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed.' });
  }
}
