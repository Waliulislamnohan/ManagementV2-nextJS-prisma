// pages/api/searchInstitutes.js
import { MongoClient } from 'mongodb';


export default async function handler(req, res) {

  const mongoUrl = process.env.DB_URL;
  const dbName = process.env.DB_NAME;
    if (req.method === 'POST') {
      const { upazilaName, instituteType } = req.body;
      let client; // Declare the client variable here
  
      try {
        const uri = mongoUrl;
        client = new MongoClient(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
  
        await client.connect();
  
        const db = client.db(dbName);
  
        const institutes = await db
          .collection('institutes')
          .find({
            'upazila': upazilaName,
            'type': instituteType,
          })
          .toArray();
  
        res.status(200).json(institutes);
      } catch (error) {
        console.error('Error searching institutes:', error);
        res.status(500).json({ error: 'An error occurred while searching institutes.' });
      } finally {
        if (client) {
          // Close the connection when done
          await client.close();
        }
      }
    } else {
      res.status(405).json({ error: 'Method not allowed.' });
    }
  }
  