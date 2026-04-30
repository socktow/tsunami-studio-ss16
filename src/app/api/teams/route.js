import { prisma } from '@/lib/database/db'

// GET all teams
export async function GET() {
  const teams = await prisma.team.findMany({
    include: { players: true },
    orderBy: { createdAt: 'desc' }
  })

  return Response.json(teams)
}

// CREATE team + players
export async function POST(req) {
  const body = await req.json()

  const team = await prisma.team.create({
    data: {
      name: body.name,
      tagName: body.tagName,
      logo: body.logo,
      color: body.color,

      players: {
        create: body.players || []
      }
    }
  })

  return Response.json(team)
}

// DELETE team
export async function DELETE(req) {
  const { id } = await req.json()

  await prisma.team.delete({
    where: { id }
  })

  return Response.json({ ok: true })
}