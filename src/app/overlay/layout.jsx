"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
  LeagueBroadcastClient,
  GameState,
} from "@bluebottle_gg/league-broadcast-client";

const LeagueDataContext = createContext({
  gameData: null,
  gameStatus: GameState.OutOfGame,
});

export const useLeagueData = () => useContext(LeagueDataContext);

export default function OverlayLayout({ children }) {
  const [gameData, setGameData] = useState(null);
  const [gameStatus, setGameStatus] = useState(GameState.OutOfGame);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const client = new LeagueBroadcastClient({
      host: "localhost",
      port: 58869,
      autoConnect: true,
    });
    client.onIngameStateUpdate((data) => {
      setGameData(data);
      console.log("Dữ liệu game", data)
    });

    // Cleanup khi component unmount
    return () => {
      if (client.disconnect) {
        client.disconnect();
      }
    };
  }, []);
  const contextValue = useMemo(() => ({
    gameData,
    gameStatus
  }), [gameData, gameStatus]);

  if (!mounted) {
    return <div className="bg-transparent">{children}</div>;
  }

  return (
    <LeagueDataContext.Provider value={contextValue}>
      <div 
        className="bg-transparent overflow-hidden m-0 p-0 min-h-screen w-full"
        suppressHydrationWarning
      >
        {children}
      </div>
    </LeagueDataContext.Provider>
  );
}