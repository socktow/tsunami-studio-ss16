"use client";

import React from "react";
import { useScoreboardData } from "@/hooks/useApiTeamData";

const TestPage = () => {
  const { allPlayerNames } = useScoreboardData();

  return (
    <div className="p-10 text-white bg-black min-h-screen">
      <h1 className="text-3xl mb-6 font-bold">
        Player Names
      </h1>

      <div className="space-y-3">
        {allPlayerNames.map((name, index) => (
          <div
            key={index}
            className="bg-zinc-800 p-4 rounded-xl border border-zinc-700"
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestPage;