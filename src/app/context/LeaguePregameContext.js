"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const LeagueDataContext = createContext({
  gameData: null,
});

export const useLeagueData = () => useContext(LeagueDataContext);

export default function LeagueDataProvider({ children }) {
  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:58869/ws/pre");

    socket.onmessage = (event) => {
      // 1. BỎ QUA: Nếu là tin nhắn KeepAlive thì thoát luôn, không xử lý tiếp
      if (event.data === "KeepAlive") {
        return;
      }

      try {
        const parsed = JSON.parse(event.data);

        setGameData((prevData) => {
          if (parsed.type === "ingame-state-update") {
            return {
              ...prevData,
              type: parsed.type,
              state: parsed.state,
            };
          }

          return {
            ...prevData,
            ...parsed,
          };
        });
      } catch (err) {
        // Chỉ log lỗi nếu dữ liệu thực sự hỏng chứ không phải do chuỗi KeepAlive
        console.error("WS JSON Parse Error:", err, "Raw Data:", event.data);
      }
    };

    return () => socket.close();
  }, []);

  const value = useMemo(
    () => ({
      gameData,
    }),
    [gameData]
  );

  return (
    <LeagueDataContext.Provider value={value}>
      {children}
    </LeagueDataContext.Provider>
  );
}