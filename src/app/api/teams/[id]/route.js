import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET by id
export async function GET(req, { params }) {
  const { id } = await params; // Phải await params

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
  const { id } = await params; // Sửa lỗi: Thêm await ở đây
  const body = await req.json();

  // Đảm bảo id là số nguyên trước khi đưa vào Prisma
  const data = await prisma.team.update({
    where: { id: parseInt(id) },
    data: body
  });

  return Response.json(data);
}

// DELETE
export async function DELETE(req, { params }) {
  const { id } = await params; // Sửa lỗi: Thêm await ở đây

  await prisma.team.delete({
    where: { id: parseInt(id) }
  });

  return Response.json({ message: "Deleted" });
}