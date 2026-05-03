import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Lấy chi tiết giải đấu
export async function GET(req, context) {
  // QUAN TRỌNG: await params trước khi lấy id
  const params = await context.params; 
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const data = await prisma.tournament.findUnique({
      where: { id: id },
      include: {
        teams: {
          include: {
            team: true,
          },
        },
      },
    });

    if (!data) {
      return Response.json({ error: "Tournament not found" }, { status: 404 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Cập nhật giải đấu
export async function PUT(req, context) {
  const params = await context.params;
  const id = parseInt(params.id);
  const body = await req.json();

  try {
    const data = await prisma.tournament.update({
      where: { id },
      data: {
        ...body,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
      },
    });

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Xóa giải đấu
export async function DELETE(req, context) {
  const params = await context.params;
  const id = parseInt(params.id);

  try {
    await prisma.tournament.delete({
      where: { id },
    });

    return Response.json({ message: "Deleted successfully" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}