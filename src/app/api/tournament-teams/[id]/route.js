import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// DELETE: Xóa đội khỏi giải đấu (Dùng ID của bảng TournamentTeam)
export async function DELETE(req, context) {
  try {
    const params = await context.params; // Next.js 15 fix
    const id = parseInt(params.id);

    await prisma.tournamentTeam.delete({
      where: { id },
    });

    return Response.json({ message: "Đã xóa đội khỏi giải đấu" });
  } catch (err) {
    return Response.json({ error: "Không tìm thấy bản ghi để xóa" }, { status: 404 });
  }
}