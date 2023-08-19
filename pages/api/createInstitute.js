import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { instituteName, location, distance, studentsNumber, eiin, typeId, upazilaId } = req.body;

      const createdInstitute = await prisma.institute.create({
        data: {
          name: instituteName,
          location,
          distance,
          institutesNum: parseInt(studentsNumber), // Convert to an integer
          eiin,
          typeId,
          upazilaId,
        },
      }); 

      res.status(201).json(createdInstitute);
    } catch (error) {
      console.error('Error creating institute:', error);
      res.status(500).json({ error: 'An error occurred while creating the institute.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed.' });
  }
}
