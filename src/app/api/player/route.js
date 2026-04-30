import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all players
export async function GET() {
  const data = await prisma.player.findMany({
    include: {
      team: true
    }
  });

  return Response.json(data);
}

// POST create player
export async function POST(req) {
  const body = await req.json();

  const { nickname, avatar, role, teamId } = body;

  const data = await prisma.player.create({
    data: {
      nickname,
      avatar,
      role,
      teamId
    }
  });

  return Response.json(data);
}