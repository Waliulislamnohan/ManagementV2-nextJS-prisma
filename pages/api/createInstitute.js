import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  const mongoUrl = process.env.DB_URL;
  const dbName = process.env.DB_NAME;
  if (req.method === 'POST') {
    const {
      name: instituteName,
      location,
      distance,
      institutesNum: studentsNumber,
      eiin,
      upazila: upazilaName,
      type: instituteType,
    } = req.body;

    try {
      const uri = mongoUrl;
      const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

      await client.connect();
      const db = client.db(dbName);


      const newInstitute = {
        name: instituteName,
        location,
        distance,
        institutesNum: studentsNumber,
        eiin,
        upazila: upazilaName,
        type: instituteType,
      };

    await db.collection('institutes').insertOne(newInstitute);

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
