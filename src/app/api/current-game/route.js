import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/db";

export async function GET() {
  try {
    const activeMatch = await prisma.match.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' }
    });

    if (!activeMatch) {
      return NextResponse.json({ message: "No active match" }, { status: 200 });
    }

    // Parse dữ liệu từ chuỗi JSON trong DB
    const rawTeamsData = JSON.parse(activeMatch.teamsData);

    // Lọc bỏ các trường không cần thiết trong players
    const cleanedTeamsData = rawTeamsData.map(team => ({
      ...team,
      players: team.players?.map(({ id, teamId, createdAt, updatedAt, ...rest }) => rest) || []
    }));

    return NextResponse.json({
      ...activeMatch,
      teamsData: cleanedTeamsData
    });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    
    // Đảm bảo body có dữ liệu
    if (!body.tournamentName || !body.teamsData) {
        return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    await prisma.match.updateMany({
      data: { isActive: false }
    });

    const newMatch = await prisma.match.create({
      data: {
        tournamentName: body.tournamentName,
        matchType: body.matchType,
        teamsData: JSON.stringify(body.teamsData),
        isActive: true
      }
    });

    return NextResponse.json({ ...newMatch, teamsData: body.teamsData });
  } catch (error) {
    console.error("POST Error:", error); // Log ra để debug
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}

// 3. PUT: Cập nhật dữ liệu cho trận đang Live (thường dùng để update tỉ số)
export async function PUT(req) {
  try {
    const body = await req.json();

    // Tìm trận đang active để update
    const activeMatch = await prisma.match.findFirst({
      where: { isActive: true }
    });

    if (!activeMatch) {
      return NextResponse.json({ error: "No active match to update" }, { status: 404 });
    }

    const updatedMatch = await prisma.match.update({
      where: { id: activeMatch.id },
      data: {
        tournamentName: body.tournamentName || activeMatch.tournamentName,
        matchType: body.matchType || activeMatch.matchType,
        teamsData: body.teamsData ? JSON.stringify(body.teamsData) : activeMatch.teamsData,
      }
    });

    return NextResponse.json({ 
      ...updatedMatch, 
      teamsData: body.teamsData || JSON.parse(updatedMatch.teamsData) 
    });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// 4. DELETE: Kết thúc trận đấu (Tắt Active)
export async function DELETE() {
  try {
    await prisma.match.updateMany({
      where: { isActive: true },
      data: { isActive: false }
    });
    return NextResponse.json({ message: "All matches deactivated" });
  } catch (error) {
    return NextResponse.json({ error: "Deactivate failed" }, { status: 500 });
  }
}