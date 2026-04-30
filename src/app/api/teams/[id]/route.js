import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET by id
export async function GET(req, context) {
  const { params } = context;
  const { id } = await params;

  const data = await prisma.team.findUnique({
    where: { id: parseInt(id) },
    include: {
      players: true
    }
  });

  return Response.json(data);
}

// PUT update
export async function PUT(req, { params }) {
  const id = parseInt(params.id);
  const body = await req.json();

  const data = await prisma.team.update({
    where: { id },
    data: body
  });

  return Response.json(data);
}

// DELETE
export async function DELETE(req, { params }) {
  const id = parseInt(params.id);

  await prisma.team.delete({
    where: { id }
  });

  return Response.json({ message: "Deleted" });
}