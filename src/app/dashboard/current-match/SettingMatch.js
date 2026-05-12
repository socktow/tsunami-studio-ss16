"use client";

import React, { useState, useEffect } from "react";
import {
  Save,
  Trophy,
  Users,
  Shield,
  Loader2,
} from "lucide-react";

const defaultTeams = [
  {
    name: "",
    tag: "",
    color: "#3b82f6",
    logo: "",
    players: [],
  },
  {
    name: "",
    tag: "",
    color: "#ef4444",
    logo: "",
    players: [],
  },
];

const SettingMatch = () => {
  const [formData, setFormData] = useState({
    tournamentName: "",
    matchType: "BO1",
    teamsData: defaultTeams,
  });

  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] =
    useState(null);

  const [loadingTeams, setLoadingTeams] =
    useState(false);

  const [loadingCurrent, setLoadingCurrent] =
    useState(true);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  //
  // LOAD CURRENT MATCH
  //
  useEffect(() => {
    const loadCurrentMatch = async () => {
      try {
        const res = await fetch(
          "/api/current-game"
        );

        const result = await res.json();

        if (result.success && result.data) {
          setFormData({
            tournamentName:
              result.data.tournamentName || "",

            matchType:
              result.data.matchType || "BO1",

            teamsData:
              result.data.teamsData ||
              defaultTeams,
          });
        }
      } catch (error) {
        console.error(
          "LOAD CURRENT MATCH ERROR:",
          error
        );
      } finally {
        setLoadingCurrent(false);
      }
    };

    loadCurrentMatch();
  }, []);

  //
  // LOAD TOURNAMENTS
  //
  useEffect(() => {
    fetch("/api/tournaments")
      .then((res) => res.json())
      .then((data) => setTournaments(data))
      .catch((err) =>
        console.error(
          "LOAD TOURNAMENT ERROR:",
          err
        )
      );
  }, []);

  //
  // SUBMIT
  //
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "/api/current-game",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert(
          "Broadcast synchronized!"
        );

        console.log(
          "CURRENT MATCH:",
          result
        );
      } else {
        alert(
          result.error ||
            "Something went wrong"
        );
      }
    } catch (error) {
      console.error(
        "SUBMIT ERROR:",
        error
      );

      alert(
        "Cannot connect to server"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  //
  // SELECT TOURNAMENT
  //
  const handleTournamentChange = async (
    e
  ) => {
    const tournamentId = e.target.value;

    if (!tournamentId) {
      setSelectedTournament(null);
      return;
    }

    setLoadingTeams(true);

    try {
      const res = await fetch(
        `/api/tournaments/${tournamentId}`
      );

      const data = await res.json();

      setSelectedTournament(data);

      setFormData((prev) => ({
        ...prev,
        tournamentName: data.name,
      }));
    } catch (err) {
      console.error(
        "LOAD TOURNAMENT DETAIL ERROR:",
        err
      );
    } finally {
      setLoadingTeams(false);
    }
  };

  //
  // SELECT TEAM
  //
  const handleSelectTeam = async (
    teamIndex,
    teamBasicData
  ) => {
    try {
      const res = await fetch(
        `/api/teams/${teamBasicData.id}`
      );

      const fullTeamData =
        await res.json();

      const newTeams = [
        ...formData.teamsData,
      ];

      newTeams[teamIndex] = {
        ...newTeams[teamIndex],

        name: fullTeamData.name,

        tag:
          fullTeamData.tagName,

        color:
          fullTeamData.color ||
          "#ffffff",

        logo:
          fullTeamData.logo,

        players:
          fullTeamData.players ||
          [],
      };

      setFormData({
        ...formData,
        teamsData: newTeams,
      });
    } catch (err) {
      console.error(
        "LOAD TEAM DETAIL ERROR:",
        err
      );
    }
  };

  //
  // UPDATE TEAM FIELD
  //
  const updateTeamField = (
    idx,
    field,
    value
  ) => {
    const newTeams = [
      ...formData.teamsData,
    ];

    newTeams[idx][field] = value;

    setFormData({
      ...formData,
      teamsData: newTeams,
    });
  };

  //
  // LOADING SCREEN
  //
  if (loadingCurrent) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="animate-spin" />

          Loading Current Broadcast...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight">
              Current Match Control
            </h1>

            <p className="text-slate-400 mt-2">
              Configure live broadcast data
            </p>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-5 py-3">
            <div className="text-xs uppercase text-emerald-400 font-bold">
              Broadcast Slot
            </div>

            <div className="text-lg font-bold mt-1">
              Match ID: 5
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* TOURNAMENT */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Trophy
                size={18}
                className="text-blue-400"
              />

              <h2 className="font-bold text-lg">
                Tournament Setup
              </h2>
            </div>

            <select
              onChange={
                handleTournamentChange
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 outline-none focus:border-blue-500"
            >
              <option value="">
                -- Select Tournament --
              </option>

              {tournaments.map((t) => (
                <option
                  key={t.id}
                  value={t.id}
                >
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* MATCH INFO */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <label className="block text-sm text-slate-400 mb-3">
                Tournament Name
              </label>

              <input
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 outline-none focus:border-blue-500"
                value={
                  formData.tournamentName
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,

                    tournamentName:
                      e.target.value,
                  })
                }
              />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <label className="block text-sm text-slate-400 mb-3">
                Match Type
              </label>

              <select
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 outline-none focus:border-blue-500"
                value={
                  formData.matchType
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,

                    matchType:
                      e.target.value,
                  })
                }
              >
                <option>BO1</option>
                <option>BO3</option>
                <option>BO5</option>
              </select>
            </div>
          </div>

          {/* TEAMS */}
          <div className="grid grid-cols-2 gap-8">
            {[0, 1].map((idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5"
              >
                <div className="flex items-center gap-2">
                  <Shield
                    size={16}
                    className="text-blue-400"
                  />

                  <h2 className="font-bold">
                    TEAM {idx + 1}
                  </h2>
                </div>

                {/* TEAM SELECT */}
                <select
                  disabled={
                    !selectedTournament ||
                    loadingTeams
                  }
                  onChange={(e) => {
                    const teamEntry =
                      selectedTournament.teams.find(
                        (t) =>
                          t.team.id ===
                          parseInt(
                            e.target.value
                          )
                      );

                    if (teamEntry) {
                      handleSelectTeam(
                        idx,
                        teamEntry.team
                      );
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 disabled:opacity-50"
                >
                  <option value="">
                    -- Select Team --
                  </option>

                  {selectedTournament?.teams.map(
                    (t) => (
                      <option
                        key={t.team.id}
                        value={t.team.id}
                      >
                        {t.team.name}
                      </option>
                    )
                  )}
                </select>

                {/* TEAM INFO */}
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="Team Name"
                    className="bg-slate-950 border border-slate-700 rounded-xl p-3"
                    value={
                      formData.teamsData[idx]
                        .name
                    }
                    onChange={(e) =>
                      updateTeamField(
                        idx,
                        "name",
                        e.target.value
                      )
                    }
                  />

                  <input
                    placeholder="Tag"
                    className="bg-slate-950 border border-slate-700 rounded-xl p-3 uppercase"
                    value={
                      formData.teamsData[idx]
                        .tag
                    }
                    onChange={(e) =>
                      updateTeamField(
                        idx,
                        "tag",
                        e.target.value
                      )
                    }
                  />
                </div>

                {/* COLOR */}
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={
                      formData.teamsData[idx]
                        .color
                    }
                    onChange={(e) =>
                      updateTeamField(
                        idx,
                        "color",
                        e.target.value
                      )
                    }
                    className="w-14 h-10 rounded cursor-pointer bg-transparent"
                  />

                  <div className="text-sm text-slate-400 font-mono">
                    {
                      formData.teamsData[idx]
                        .color
                    }
                  </div>
                </div>

                {/* PLAYERS */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Users
                      size={16}
                      className="text-slate-400"
                    />

                    <h3 className="text-sm uppercase text-slate-400 font-bold">
                      Players
                    </h3>
                  </div>

                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                    {formData.teamsData[idx]
                      .players?.length >
                    0 ? (
                      formData.teamsData[
                        idx
                      ].players.map(
                        (player) => (
                          <div
                            key={player.id}
                            className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center gap-3"
                          >
                            <div className="w-12 h-12 bg-slate-800 rounded-xl overflow-hidden">
                              {player.avatar ? (
                                <img
                                  src={
                                    player.avatar
                                  }
                                  alt={
                                    player.nickname
                                  }
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Users
                                    size={
                                      18
                                    }
                                    className="text-slate-500"
                                  />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="font-bold truncate">
                                {
                                  player.nickname
                                }
                              </div>

                              <div className="text-xs uppercase text-blue-400 mt-1">
                                {player.role}
                              </div>
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      <div className="border border-dashed border-slate-700 rounded-xl p-6 text-center text-slate-500 text-sm">
                        No players loaded
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 rounded-2xl p-5 font-bold flex items-center justify-center gap-3 transition-all"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Save size={20} />
            )}

            {isSubmitting
              ? "SYNCING..."
              : "SYNC CURRENT MATCH"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingMatch;