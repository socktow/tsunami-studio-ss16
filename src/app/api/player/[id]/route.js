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

// UPDATE TEAM (api/teams/[id]/route.js)
export async function PUT(req, { params }) {
  const { id: rawId } = await params;
  const id = parseInt(rawId);
  
  if (isNaN(id)) {
    return Response.json({ error: "ID không hợp lệ" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { id: _, players, createdAt, updatedAt, ...updateData } = body;

    const data = await prisma.team.update({
      where: { id },
      data: updateData, // updateData sẽ chứa { logo, name, tagName, coach, color }
    });

    return Response.json(data);
  } catch (error) {
    if (error.code === 'P2002') {
      return Response.json({ error: "Tag Name này đã tồn tại ở đội khác!" }, { status: 400 });
    }
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