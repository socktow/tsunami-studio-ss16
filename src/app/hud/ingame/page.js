"use client";

import { useEffect } from "react";
import TopLeftPanel from "./components/topleftpanel";
import TopCenterPanel from "./components/topcenterpanel";
import TopRightPanel from "./components/toprightpanel";
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
    showSkin, // Bạn có thể dùng biến này để ẩn/hiện các thành phần liên quan đến skin nếu cần
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
      {/* Nhóm các Panel phía trên (Top) */}
      {showTop && (
        <>
          <TopLeftPanel />
          <TopCenterPanel />
          {/* <TopRightPanel /> */}
        </>
      )}

      {/* Nhóm các Panel ở giữa (Center) */}
      {showSkin && <SkinShowPanel />}

      <CenterLeftPanel />

      {/* Nhóm các Panel phía dưới (Bottom) */}
      {showBottom && (
        <>
          <BottomcenterPanel />
          <BottomRightLeftPanel />
        </>
      )}
    </div>
  );
};

export default Ingame;
