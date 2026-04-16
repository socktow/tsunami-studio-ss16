import React from "react";
import Column from "../base/Column";
import FixedInnerColumn from "../base/FixedInnerColumn";
import { StatsSection } from "@/components/bottomScoreboard/StatsSection";
import { IMAGE_BASE_URL } from "@/lib/league-utils";

const L2 = ({ tabs, boards }) => {
    return (
        <div className="flex-1 flex ">

            <Column
                renderCell={(i) => {
                    const p = tabs?.[i];
                    if (!p) return null;

                    return (
                        <div className="relative w-full h-full  overflow-hidden">

                            {/* ===================== */}
                            {/* LAYER 1: BARS */}
                            {/* ===================== */}
                            <div className="absolute inset-0 flex flex-col justify-end z-0 ml-19 py-1">

                                {/* XP (tạm giữ) */}
                                <div className="h-[4px] w-full bg-purple-500/20 relative overflow-hidden">
                                    <div
                                        className="h-full bg-purple-500"
                                        style={{ width: `${p?.xp?.pct || 0}%` }}
                                    />
                                </div>

                                {/* HP */}
                                <div className="h-[7px] w-full bg-green-500/20 relative overflow-hidden">
                                    <div
                                        className="h-full bg-green-500"
                                        style={{ width: `${p?.hp?.pct || 0}%` }}
                                    />
                                </div>

                                {/* MP */}
                                <div className="h-[4px] w-full bg-blue-500/20 relative overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500"
                                        style={{ width: `${p?.mp?.pct || 0}%` }}
                                    />
                                </div>

                            </div>

                            {/* ===================== */}
                            {/* LAYER 2: ICONS */}
                            {/* ===================== */}
                            <div className="relative z-10 flex items-center gap-[4px] h-full px-[2px]">

                                {/* spells */}
                                <div className="flex flex-col gap-[2px]">
                                    {p?.spell1 && (
                                        <img
                                            className="w-[22px] h-[22px]"
                                            src={`${IMAGE_BASE_URL}${p.spell1}`}
                                        />
                                    )}
                                    {p?.spell2 && (
                                        <img
                                            className="w-[22px] h-[22px]"
                                            src={`${IMAGE_BASE_URL}${p.spell2}`}
                                        />
                                    )}
                                </div>

                                {/* champ */}
                                <img
                                    className="w-[45px] h-[45px] rounded "
                                    src={`${IMAGE_BASE_URL}${p?.champ}`}
                                />

                            </div>

                            {/* ===================== */}
                            {/* LAYER 3: NAME OVERLAY */}
                            {/* ===================== */}
                            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none mb-4 ml-12">
                                <span className="text-[13px] font-bold text-white drop-shadow">
                                    {p?.name}
                                </span>
                            </div>

                        </div>
                    );
                }}
            />

            {/* STATS */}
            <FixedInnerColumn
                renderCell={(i) => {
                    const row = boards?.[i];

                    if (!row) return null;

                    return (
                        <div className="h-full w-full min-h-0 flex items-center justify-center bg-black">
                            <StatsSection
                                kills={row?.kills}
                                deaths={row?.deaths}
                                assists={row?.assists}
                                creepScore={row?.creepScore}
                                isLeft={true}
                            />
                        </div>
                    );
                }}
            />

        </div>
    );
};

export default L2;