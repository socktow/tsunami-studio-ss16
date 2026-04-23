import React from "react";
import FixedInnerColumn from "../base/FixedInnerColumn";

const CT = () => {
  return (
    <FixedInnerColumn
      width="w-[65px]"
      renderCell={(i) => {
        return (
          <div className="relative w-full h-full flex items-center justify-center">

            {/* LEFT INDICATOR (mock) */}
            <div className="absolute left-0 h-[80%] flex items-center opacity-50">
              <div className="w-[3px] h-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
              <div
                className="w-0 h-0 
                  border-t-[5px] border-t-transparent 
                  border-b-[5px] border-b-transparent 
                  border-l-[6px] border-l-sky-400"
              />
            </div>

            {/* FAKE VALUE */}
            <span className="text-[15px] font-semibold tracking-tighter tabular-nums text-white">
              {i % 2 === 0 ? "+1200" : "-850"}
            </span>

            {/* RIGHT INDICATOR (mock) */}
            <div className="absolute right-0 h-[80%] flex items-center flex-row-reverse opacity-50">
              <div className="w-[3px] h-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
              <div
                className="w-0 h-0 
                  border-t-[5px] border-t-transparent 
                  border-b-[5px] border-b-transparent 
                  border-r-[6px] border-r-rose-500"
              />
            </div>

          </div>
        );
      }}
    />
  );
};

export default CT;