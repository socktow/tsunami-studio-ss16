import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/db";

const CURRENT_MATCH_ID = 5;

//
// GET CURRENT GAME
//
export async function GET() {
  try {
    const currentMatch = await prisma.match.findUnique({
      where: {
        id: CURRENT_MATCH_ID,
      },
    });

    if (!currentMatch) {
      return NextResponse.json(
        { success: false, message: "Current match not found" },
        { status: 404 }
      );
    }

    // Parse dữ liệu từ String JSON sang Object
    const rawTeamsData = JSON.parse(currentMatch.teamsData || "[]");

    // Tiến hành lọc bỏ các field dư thừa trong players
    const cleanedTeamsData = rawTeamsData.map((team) => ({
      ...team,
      players: team.players?.map(({ id, teamId, createdAt, updatedAt, ...playerInfo }) => ({
        ...playerInfo, // Chỉ giữ lại các field như nickname, avatar, role
      })),
    }));

    return NextResponse.json(
      {
        success: true,
        data: {
          ...currentMatch,
          teamsData: cleanedTeamsData,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json(
      { success: false, error: "GET failed" },
      { status: 500 }
    );
  }
}

//
// CREATE / UPSERT CURRENT GAME
//
export async function POST(req) {
  try {
    const body = await req.json();

    if (!body) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing body",
        },
        { status: 400 }
      );
    }

    const existed = await prisma.match.findUnique({
      where: {
        id: CURRENT_MATCH_ID,
      },
    });

    // UPDATE nếu đã tồn tại
    if (existed) {
      const updated = await prisma.match.update({
        where: {
          id: CURRENT_MATCH_ID,
        },

        data: {
          tournamentName:
            body.tournamentName ??
            existed.tournamentName,

          matchType:
            body.matchType ??
            existed.matchType,

          teamsData: JSON.stringify(
            body.teamsData ??
              JSON.parse(existed.teamsData || "[]")
          ),

          isActive: true,
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: "Current match updated",

          data: {
            ...updated,
            teamsData: JSON.parse(
              updated.teamsData || "[]"
            ),
          },
        },
        { status: 200 }
      );
    }

    // CREATE nếu chưa tồn tại
    const created = await prisma.match.create({
      data: {
        id: CURRENT_MATCH_ID,

        tournamentName:
          body.tournamentName || "",

        matchType:
          body.matchType || "BO1",

        teamsData: JSON.stringify(
          body.teamsData || []
        ),

        isActive: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Current match created",

        data: {
          ...created,
          teamsData: JSON.parse(
            created.teamsData || "[]"
          ),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "POST failed",
      },
      { status: 500 }
    );
  }
}

//
// UPDATE CURRENT GAME
//
export async function PUT(req) {
  try {
    const body = await req.json();

    const existed = await prisma.match.findUnique({
      where: {
        id: CURRENT_MATCH_ID,
      },
    });

    if (!existed) {
      return NextResponse.json(
        {
          success: false,
          error: "Current match not found",
        },
        { status: 404 }
      );
    }

    const updated = await prisma.match.update({
      where: {
        id: CURRENT_MATCH_ID,
      },

      data: {
        tournamentName:
          body.tournamentName ??
          existed.tournamentName,

        matchType:
          body.matchType ??
          existed.matchType,

        teamsData: body.teamsData
          ? JSON.stringify(body.teamsData)
          : existed.teamsData,

        isActive:
          body.isActive ??
          existed.isActive,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Current match updated",

        data: {
          ...updated,
          teamsData: JSON.parse(
            updated.teamsData || "[]"
          ),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "PUT failed",
      },
      { status: 500 }
    );
  }
}

//
// DELETE CURRENT GAME
//
export async function DELETE() {
  try {
    const existed = await prisma.match.findUnique({
      where: {
        id: CURRENT_MATCH_ID,
      },
    });

    if (!existed) {
      return NextResponse.json(
        {
          success: false,
          error: "Current match not found",
        },
        { status: 404 }
      );
    }

    await prisma.match.delete({
      where: {
        id: CURRENT_MATCH_ID,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Current match deleted",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "DELETE failed",
      },
      { status: 500 }
    );
  }
}