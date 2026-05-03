import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { tournamentId, teamId } = body;

    // Log để kiểm tra dữ liệu thực tế server nhận được
    console.log("Server nhận dữ liệu:", { tournamentId, teamId });

    if (!tournamentId || !teamId) {
      return NextResponse.json({ error: "Dữ liệu thiếu" }, { status: 400 });
    }

    const result = await prisma.tournamentTeam.create({
      data: {
        tournamentId: Number(tournamentId), // Ép kiểu chắc chắn về số
        teamId: Number(teamId),
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error("Lỗi Prisma:", err.code, err.message);
    
    // Nếu lỗi P2002 tức là cặp ID này đã tồn tại (do @@unique)
    if (err.code === 'P2002') {
      return NextResponse.json({ message: "Đội đã có trong giải" }, { status: 409 });
    }

    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Thêm GET để test xem route có sống không
export async function GET() {
    return NextResponse.json({ status: "Route tournament-teams is working!" });
}