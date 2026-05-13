"use client";
import React from 'react';
import SplitComponent from './SplitComponent';
import CenterComponent from './CenterComponent';
import EventComponent from './EventComponent';
import { useScoreboardData } from '@/hooks/useApiTeamData';

const Index = () => {
  const apiResponse = useScoreboardData();

  if (!apiResponse || !apiResponse.matchInfo || !apiResponse.scoreboard) return null;

  const { matchInfo, scoreboard } = apiResponse;

  const teamBlueInfo = matchInfo.teamsData[0];
  const teamRedInfo = matchInfo.teamsData[1];

  const teamBlueStats = scoreboard.teams[0];
  const teamRedStats = scoreboard.teams[1];

  console.log(scoreboard)

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-row items-start w-fit">

        {/* --- BÊN TRÁI (BLUE TEAM) --- */}
        <div className="flex items-start relative">
          {/* Truyền dữ liệu PowerPlay vào EventComponent */}
          <EventComponent
            isRightSide={false}
            gameTime={scoreboard.gameTime}
            baronPowerPlay={teamBlueStats.baronPowerPlay}
            dragonPowerPlay={teamBlueStats.dragonPowerPlay}
          />
          <SplitComponent
            isRightSide={false}
            teamData={teamBlueInfo}
            statsData={{
              gold: teamBlueStats.gold,
              towers: teamBlueStats.towers,
              towerPlates: teamBlueStats.towerPlates,
              dragons: teamBlueStats.dragons,
              grubs: teamBlueStats.grubs,
            }}
            matchType={matchInfo.matchType}
          />
        </div>

        {/* --- TRUNG TÂM (CENTER) --- */}
        <CenterComponent
          blueKills={teamBlueStats.kills}
          redKills={teamRedStats.kills}
          gameTime={scoreboard.gameTime}
        />

        {/* --- BÊN PHẢI (RED TEAM) --- */}
        <div className="flex flex-row-reverse items-start relative">
          {/* Truyền dữ liệu PowerPlay vào EventComponent */}
          <EventComponent
            gameTime={scoreboard.gameTime}
            isRightSide={true}
            baronPowerPlay={teamRedStats.baronPowerPlay}
            dragonPowerPlay={teamRedStats.dragonPowerPlay}
          />
          <SplitComponent
            isRightSide={true}
            teamData={teamRedInfo}
            statsData={{
              gold: teamRedStats.gold,
              towers: teamRedStats.towers,
              towerPlates: teamRedStats.towerPlates,
              dragons: teamRedStats.dragons,
              grubs: teamRedStats.grubs,
            }}
            matchType={matchInfo.matchType}
          />
        </div>

      </div>
    </div>
  );
};

export default Index;