"use client";

import React from "react";
import usePregamedata from "@/hooks/usePregamedata";

const Page = () => {
  const data = usePregamedata();

  if (!data) {
    return (
      <div className="text-black p-10">
        Waiting for timer data...
      </div>
    );
  }

  return (
    <div className="text-black p-10 space-y-4">
      <h1 className="text-4xl font-bold">
        Pregame Timer
      </h1>

      <div className="bg-zinc-200 rounded-2xl p-6 w-fit space-y-2">
        <p className="text-2xl font-semibold">
          Phase: {data.phaseName}
        </p>

        <p className="text-xl">
          Duration: {data.phaseDuration}s
        </p>

        <p className="text-xl">
          Remaining: {data.timeRemaining}s
        </p>
      </div>

      <pre className="bg-zinc-100 p-4 rounded-2xl overflow-auto text-sm">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default Page;