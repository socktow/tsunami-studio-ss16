"use client";

import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

import TopLeftPanel from "./components/topleftpanel";
import TopCenterPanel from "./components/topcenterpanel";
import SkinShowPanel from "./components/centerleftpanel/skinshowpanel";
import CenterLeftPanel from "./components/centerleftpanel";
import BottomcenterPanel from "./components/bottomcenterpanel";
import MiniMapSponsor from "./components/MiniMapSponsor";
import PlayerCard from "./components/playercard";
import PlayerRunes from "./components/PlayerRunes";
import KillFeed from "./components/toprightpanel";
import { useOverlayStore } from "@/store/overlayStore";

const socket = io("http://localhost:3001");

const Ingame = () => {
  const {
    showOverlay,
    showTop,
    showBottom,
    showSkin,
    showplayercard,
    showplayerRunes,
    setState,
  } = useOverlayStore();

  // ref giữ handler mới nhất
  const setStateRef = useRef(setState);

  // update ref khi setState đổi
  useEffect(() => {
    setStateRef.current = setState;
  }, [setState]);

  // subscribe socket chỉ 1 lần
  useEffect(() => {
    const handleInit = (data) => {
      setStateRef.current(data);
    };

    const handleState = (data) => {
      setStateRef.current(data);
    };

    socket.on("init", handleInit);
    socket.on("state", handleState);

    return () => {
      socket.off("init", handleInit);
      socket.off("state", handleState);
    };
  }, []);

  if (!showOverlay) return null;

  return (
    <div className="fixed inset-0 bg-transparent pointer-events-none select-none z-[99999]">

      {/* TOP */}
      {/* <KillFeed /> */}
      {showplayerRunes && <PlayerRunes />}
      <MiniMapSponsor />
      <TopLeftPanel />
      {showTop && (
        <div className="absolute top-0 left-0 right-0 flex justify-center items-start">
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
        </div>
      )}
      {showplayercard && <PlayerCard />}
    </div>
  );
};

export default Ingame;