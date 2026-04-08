"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { useOverlayStore } from "@/store/overlayStore";
import TopScoreboard from "@/components/topscoreboard/page";
import BottomScoreboard from "@/components/bottomScoreboard/page";

const socket = io("http://localhost:3001");

export default function Overlay() {
  const { showOverlay, showTop, showBottom, setState } =
    useOverlayStore();

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
  <div className="fixed inset-0 bg-transparent pointer-events-none">
    <div className="absolute inset-0 bg-transparent" />
    
    {showTop && <TopScoreboard />}
    {showBottom && <BottomScoreboard />}
  </div>
);
}