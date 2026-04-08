"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { useOverlayStore } from "@/store/overlayStore";

const socket = io("http://localhost:3001");

export default function Dashboard() {
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

  const update = (data) => {
    socket.emit("update", data);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 space-y-4">
      <h1 className="text-2xl font-bold">Dashboard Control</h1>

      <button
        onClick={() => update({ showOverlay: !showOverlay })}
        className="px-4 py-2 bg-blue-500 rounded"
      >
        {showOverlay ? "Hide Overlay" : "Show Overlay"}
      </button>

      <button
        onClick={() => update({ showTop: !showTop })}
        className="px-4 py-2 bg-green-500 rounded"
      >
        Top Scoreboard: {showTop ? "ON" : "OFF"}
      </button>

      <button
        onClick={() => update({ showBottom: !showBottom })}
        className="px-4 py-2 bg-purple-500 rounded"
      >
        Bottom Scoreboard: {showBottom ? "ON" : "OFF"}
      </button>
    </div>
  );
}