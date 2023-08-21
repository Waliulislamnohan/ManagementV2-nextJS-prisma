// pages/api/searchInstitutes.js
import { MongoClient } from 'mongodb';
export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { upazilaName, instituteType } = req.body;
      let client; // Declare the client variable here
  
      try {
        const uri = 'mongodb+srv://dev_admin:dev_admin@cluster0.wtpkorv.mongodb.net/?retryWrites=true&w=majority';
        client = new MongoClient(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
  
        await client.connect();
  
        const db = client.db('test');
  
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
  