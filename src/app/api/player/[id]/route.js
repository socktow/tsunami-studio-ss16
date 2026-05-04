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
// UPDATE
export async function PUT(req, { params }) {
  const { id: rawId } = await params; 
  const id = parseInt(rawId);
  if (isNaN(id)) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }

  const body = await req.json();
  const { id: _, team, createdAt, updatedAt, ...updateData } = body;

  try {
    const data = await prisma.player.update({
      where: { id },
      data: updateData,
    });

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req, { params }) {
  const id = parseInt(params.id);

  await prisma.player.delete({
    where: { id }
  });

  return Response.json({ message: "Deleted" });
}