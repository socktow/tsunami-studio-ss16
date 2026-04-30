'use client'

import { useEffect, useState } from 'react'

export default function TestAPI() {
  const [teams, setTeams] = useState([])
  const [name, setName] = useState('')
  const [tagName, setTagName] = useState('')
  const [logo, setLogo] = useState('')
  const [color, setColor] = useState('#000000')
  const [players, setPlayers] = useState([{ name: '', role: '' }])
  const [loading, setLoading] = useState(false)

  async function loadTeams() {
    const res = await fetch('/api/teams')
    const data = await res.json()
    setTeams(data)
  }

  async function addTeam() {
    setLoading(true)

    await fetch('/api/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        tagName,
        logo,
        color,
        players
      })
    })

    setName('')
    setTagName('')
    setLogo('')
    setColor('#000000')
    setPlayers([{ name: '', role: '' }])
    setLoading(false)

    loadTeams()
  }

  async function deleteTeam(id) {
    await fetch('/api/teams', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })

    loadTeams()
  }

  function updatePlayer(index, field, value) {
    const newPlayers = [...players]
    newPlayers[index][field] = value
    setPlayers(newPlayers)
  }

  function addPlayerField() {
    setPlayers([...players, { name: '', role: '' }])
  }

  useEffect(() => {
    loadTeams()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow">

        <h1 className="text-2xl font-bold mb-4">Team Esports</h1>

        {/* FORM */}
        <div className="space-y-3 mb-6">

          <input
            className="w-full border p-2 rounded-lg"
            placeholder="Team Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <input
            className="w-full border p-2 rounded-lg"
            placeholder="Tag Name"
            value={tagName}
            onChange={e => setTagName(e.target.value)}
          />

          <input
            className="w-full border p-2 rounded-lg"
            placeholder="Logo URL"
            value={logo}
            onChange={e => setLogo(e.target.value)}
          />

          <input
            type="color"
            value={color}
            onChange={e => setColor(e.target.value)}
          />

          {/* PLAYERS */}
          <div>
            <h3 className="font-semibold mb-2">Players</h3>

            {players.map((p, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  className="border p-2 rounded w-1/2"
                  placeholder="Name"
                  value={p.name}
                  onChange={e => updatePlayer(i, 'name', e.target.value)}
                />
                <input
                  className="border p-2 rounded w-1/2"
                  placeholder="Role"
                  value={p.role}
                  onChange={e => updatePlayer(i, 'role', e.target.value)}
                />
              </div>
            ))}

            <button
              onClick={addPlayerField}
              className="text-blue-500 text-sm"
            >
              + Add Player
            </button>
          </div>

          <button
            onClick={addTeam}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg"
          >
            {loading ? 'Adding...' : 'Add Team'}
          </button>

        </div>

        {/* LIST */}
        <div className="space-y-4">
          {teams.map(team => (
            <div key={team.id} className="border p-4 rounded-xl">

              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-bold">
                    {team.name} ({team.tagName})
                  </h2>
                  <div
                    className="w-4 h-4 rounded mt-1"
                    style={{ background: team.color }}
                  />
                </div>

                <button
                  onClick={() => deleteTeam(team.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>

              <div className="mt-3">
                <h4 className="font-semibold">Players:</h4>

                {team.players.map(p => (
                  <div key={p.id} className="text-sm text-gray-600">
                    {p.name} - {p.role}
                  </div>
                ))}
              </div>

            </div>
          ))}

          {teams.length === 0 && (
            <p className="text-center text-gray-400">No teams yet</p>
          )}
        </div>

      </div>
    </div>
  )
}