import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all tournaments
export async function GET() {
  const data = await prisma.tournament.findMany({
    include: {
      teams: {
        include: {
          team: true,
        },
      },
    },
  });

  return Response.json(data);
}

// POST create tournament
export async function POST(req) {
  const body = await req.json();

  const { name, logo, startDate, status } = body;

  const data = await prisma.tournament.create({
    data: {
      name,
      logo,
      startDate: new Date(startDate),
      status,
      teamCount: 0, 
    },
  });

  return Response.json(data);
}