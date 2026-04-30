import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// GET all tournaments
router.get("/", async (req, res) => {
  const data = await prisma.tournament.findMany({
    include: {
      teams: {
        include: {
          team: true
        }
      }
    }
  });
  res.json(data);
});

// GET tournament by id
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const data = await prisma.tournament.findUnique({
    where: { id },
    include: {
      teams: {
        include: { team: true }
      }
    }
  });

  res.json(data);
});

// POST create tournament
router.post("/", async (req, res) => {
  const { name, logo, teamCount, startDate, status } = req.body;

  const data = await prisma.tournament.create({
    data: {
      name,
      logo,
      teamCount,
      startDate: new Date(startDate),
      status
    }
  });

  res.json(data);
});

export default router;