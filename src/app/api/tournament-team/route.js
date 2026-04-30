import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// GET teams in tournament
router.get("/:tournamentId", async (req, res) => {
  const tournamentId = parseInt(req.params.tournamentId);

  const data = await prisma.tournamentTeam.findMany({
    where: { tournamentId },
    include: {
      team: true
    }
  });

  res.json(data);
});

// POST add team to tournament
router.post("/", async (req, res) => {
  const { tournamentId, teamId } = req.body;

  try {
    const data = await prisma.tournamentTeam.create({
      data: {
        tournamentId,
        teamId
      }
    });

    res.json(data);
  } catch (err) {
    res.status(400).json({
      message: "Team already added or invalid data",
      error: err.message
    });
  }
});

export default router;