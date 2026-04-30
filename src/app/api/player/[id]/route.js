import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET by id
export async function GET(req, { params }) {
  const id = parseInt(params.id);

  const data = await prisma.player.findUnique({
    where: { id },
    include: {
      team: true
    }
  });

  return Response.json(data);
}

// UPDATE
export async function PUT(req, { params }) {
  const id = parseInt(params.id);
  const body = await req.json();

  const data = await prisma.player.update({
    where: { id },
    data: body
  });

  return Response.json(data);
}

// DELETE
export async function DELETE(req, { params }) {
  const id = parseInt(params.id);

  await prisma.player.delete({
    where: { id }
  });

  return Response.json({ message: "Deleted" });
}