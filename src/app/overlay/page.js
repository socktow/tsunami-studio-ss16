"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { useOverlayStore } from "@/store/overlayStore";
import TopScoreboard from "@/components/topscoreboard/page";
import BottomScoreboard from "@/components/bottomScoreboard";
import TopLeftPanel from "@/components/topleftpanel/page"; 
import Centerleftpanel from "@/components/centerpanel/centerleftpanel/page"
import SkinShowPanel from "@/components/centerpanel/centerpanel/skinshowpanel/page";
const socket = io("http://localhost:3001");

export default function Overlay() {
  const { showOverlay, showTop, showBottom, showSkin, setState , allPlayerData} = useOverlayStore();

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
      {showTop && <TopScoreboard />}
      <TopLeftPanel />
      <Centerleftpanel />
      {showSkin && <SkinShowPanel allPlayers={allPlayerData?.allPlayers || []} />}
      {showBottom && <BottomScoreboard />}
    </div>
  );
}