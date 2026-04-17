import React from "react";
import Column from "../base/Column";

const R2 = ({ data }) => {
  return (
    <Column
      label="R2"
      renderCell={() => (
        <div className="flex items-center w-full h-full px-1 justify-between">

          {/* ===================== */}
          {/* 9 - 10 (LEFT) */}
          {/* ===================== */}
          <div className="flex flex-col gap-[3px]">

            <div className="
              w-[16px] h-[16px]
              bg-zinc-800 border border-zinc-700
              flex items-center justify-center
              rounded-[2px]
            ">
              <span className="text-[9px] font-bold text-zinc-300 leading-none">
                9
              </span>
            </div>

            <div className="
              w-[16px] h-[16px]
              bg-zinc-600 border border-zinc-500
              flex items-center justify-center
              rounded-[2px]
            ">
              <span className="text-[9px] font-bold text-white leading-none">
                10
              </span>
            </div>

          </div>

          {/* ===================== */}
          {/* 8 - 1 (REVERSED GRID) */}
          {/* ===================== */}
          <div className="flex items-center gap-[3px]">

            {Array.from({ length: 8 })
              .map((_, i) => 8 - i)   // 🔥 reverse order
              .map((num) => (
                <div
                  key={num}
                  className="
                    w-[21px]
                    h-[21px]
                    bg-zinc-800
                    border border-zinc-700
                    flex items-center justify-center
                    rounded-[2px]
                  "
                >
                  <span className="text-[9px] font-black text-zinc-300 leading-none">
                    {num}
                  </span>
                </div>
              ))}

          </div>

        </div>
      )}
    />
  );
};

export default R2;