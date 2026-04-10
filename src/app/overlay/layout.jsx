"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  LeagueBroadcastClient,
  GameState,
} from "@bluebottle_gg/league-broadcast-client";

// Tạo Context
const LeagueDataContext = createContext({
  gameData: null,
  gameStatus: "OutOfGame",
});

export const useLeagueData = () => useContext(LeagueDataContext);

export default function OverlayLayout({ children }) {
  const [gameData, setGameData] = useState(null);
  const [gameStatus, setGameStatus] = useState(GameState.OutOfGame);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Đánh dấu đã mounted để tránh lỗi Hydration
    setMounted(true);

    const client = new LeagueBroadcastClient({
      host: "localhost",
      port: 58869,
      autoConnect: true,
    });

    client.onIngameStateUpdate((data) => {
      // Log để kiểm tra dữ liệu thực tế từ Tool
      console.log("Dữ liệu game mới:", data);
      setGameData(data);
    });

    client.onIngameStatusChange((status) => {
      setGameStatus(status);
    });

    client.onIngameEvents({
      onKillFeedEvent: (event) => console.log("Kill:", event),
      onObjectiveEvent: (event) => console.log("Objective:", event),
    });

    return () => {
      // Hầu hết các client socket có hàm close hoặc disconnect
      if (client.disconnect) client.disconnect();
    };
  }, []);

  // Nếu chưa mounted (đang ở Server), render một div rỗng hoặc children cơ bản 
  // để tránh lệch thuộc tính HTML với Client
  if (!mounted) {
    return <div className="bg-transparent">{children}</div>;
  }

  return (
    <LeagueDataContext.Provider value={{ gameData, gameStatus }}>
      <div 
        className="bg-transparent overflow-hidden m-0 p-0 min-h-screen"
        suppressHydrationWarning
      >
        {children}
      </div>
    </LeagueDataContext.Provider>
  );
}