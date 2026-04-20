"use client";



import React, { createContext, useContext, useEffect, useState, useMemo } from "react";

import {

  LeagueBroadcastClient,

  GameState,

} from "@bluebottle_gg/league-broadcast-client";



// 1. Khởi tạo Context với giá trị mặc định

const LeagueDataContext = createContext({

  gameData: null,

  gameStatus: GameState.OutOfGame,

});



// 2. Hook để các selector hoặc component con sử dụng

export const useLeagueData = () => useContext(LeagueDataContext);



/**

 * LeagueDataProvider - Thành phần bao bọc (Wrapper) duy nhất

 * Quản lý kết nối WebSocket và cung cấp dữ liệu cho toàn bộ Overlay

 */

export default function LeagueDataProvider({ children }) {

  const [gameData, setGameData] = useState(null);

  const [gameStatus, setGameStatus] = useState(GameState.OutOfGame);

  const [mounted, setMounted] = useState(false);



  useEffect(() => {

    // Đánh dấu component đã mount để tránh lỗi Hydration trên Next.js

    setMounted(true);



    // Khởi tạo Client kết nối đến League Broadcast

    const client = new LeagueBroadcastClient({

      host: "localhost",

      port: 58869,

      autoConnect: true,

    });



    // Lắng nghe dữ liệu game mỗi khi có cập nhật (tick rate)

    client.onIngameStateUpdate((data) => {

      setGameData(data);

      // console.log("Data nhận được:", data); // Debug nếu cần

    });



    // Lắng nghe thay đổi trạng thái game (InGame, OutOfGame, v.v.)

    // Lưu ý: Tùy phiên bản SDK mà hàm này có thể khác tên

    if (client.onGameStateChange) {

      client.onGameStateChange((status) => {

        setGameStatus(status);

      });

    }



    // Cleanup: Ngắt kết nối khi đóng Overlay hoặc Refresh trang

    return () => {

      if (client.disconnect) {

        console.log("Đang ngắt kết nối League Client...");

        client.disconnect();

      }

    };

  }, []);



  // Memoize giá trị context để tránh re-render không cần thiết cho các component con

  const contextValue = useMemo(() => ({

    gameData,

    gameStatus

  }), [gameData, gameStatus]);



  // Nếu chưa mount (phía Server), trả về div rỗng với class transparent

  if (!mounted) {

    return <div className="bg-transparent">{children}</div>;

  }



  return (

    <LeagueDataContext.Provider value={contextValue}>

      <div

        className="bg-transparent overflow-hidden m-0 p-0 min-h-screen w-full relative"

        suppressHydrationWarning

      >

        {children}

      </div>

    </LeagueDataContext.Provider>

  );

}

