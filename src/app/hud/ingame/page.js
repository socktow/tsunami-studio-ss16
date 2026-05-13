"use client";

import { useEffect } from "react";
import TopLeftPanel from "./components/topleftpanel";
import TopCenterPanel from "./components/topcenterpanel";
import SkinShowPanel from "./components/centerleftpanel/skinshowpanel";
import CenterLeftPanel from "./components/centerleftpanel";
import BottomcenterPanel from "./components/bottomcenterpanel";
import BottomRightLeftPanel from "./components/bottomrightleftpanel";
import { io } from "socket.io-client";
import { useOverlayStore } from "@/store/overlayStore";

const socket = io("http://localhost:3001");

const Ingame = () => {
  const {
    showOverlay,
    showTop,
    showBottom,
    showSkin,
    setState,
  } = useOverlayStore();

  useEffect(() => {
    socket.on("init", setState);
    socket.on("state", setState);

    return () => {
      socket.off("init");
      socket.off("state");
    };
  }, [setState]);

  if (!showOverlay) return null;

  return (
    <div className="fixed inset-0 bg-transparent pointer-events-none select-none">
      
      {/* --- LAYER PHÍA TRÊN (TOP) --- */}
      {showTop && (
        <div className="absolute top-0 left-0 right-0 flex justify-center items-start">
          {/* TopLeftPanel tự quản lý vị trí absolute bên trong nó hoặc bạn bọc thêm div */}
          <TopLeftPanel />
          
          {/* TopCenterPanel chứa Scoreboard và EventComponent */}
          <TopCenterPanel />
          
          {/* <TopRightPanel /> */}
        </div>
      )}

      {/* --- LAYER GIỮA (CENTER) --- */}
      {/* Dùng absolute để cố định vị trí giữa màn hình, không phụ thuộc vào Top */}
      <div className="absolute inset-0 flex items-center">
         {showSkin && <SkinShowPanel />}
         <CenterLeftPanel />
      </div>

      {/* --- LAYER PHÍA DƯỚI (BOTTOM) --- */}
      {showBottom && (
        <div className="absolute bottom-0 left-0 right-0">
          <BottomcenterPanel />
          <BottomRightLeftPanel />
        </div>
      )}
      
    </div>
  );
};

export default Ingame;