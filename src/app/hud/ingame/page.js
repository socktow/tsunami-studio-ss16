"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";

import TopLeftPanel from "./components/topleftpanel";
import TopCenterPanel from "./components/topcenterpanel";
import SkinShowPanel from "./components/centerleftpanel/skinshowpanel";
import CenterLeftPanel from "./components/centerleftpanel";
import BottomcenterPanel from "./components/bottomcenterpanel";
import BottomRightLeftPanel from "./components/bottomrightleftpanel";

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
    <div className="fixed inset-0 bg-transparent pointer-events-none select-none z-[99999]">

      {/* TOP */}
      {showTop && (
        <div className="absolute top-0 left-0 right-0 flex justify-center items-start">
          <TopLeftPanel />
          <TopCenterPanel />
        </div>
      )}

      {/* CENTER */}
      <div className="absolute inset-0 flex items-center">
        {showSkin && <SkinShowPanel />}
        <CenterLeftPanel />
      </div>

      {/* BOTTOM */}
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