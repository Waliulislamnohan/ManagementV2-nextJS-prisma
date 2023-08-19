
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const types = await prisma.instituteType.findMany();
    const upazilas = await prisma.upazila.findMany();

    res.status(200).json({ types, upazilas });
  } catch (error) {
    console.error('Error fetching IDs:', error);
    res.status(500).json({ error: 'An error occurred while fetching IDs.' });
  }
}