import React, { useMemo } from "react";
import { useLeagueData } from "@/app/overlay/layout";
import { getTeamData, formatGold } from "@/lib/league-utils";
import { mapTabsToL2 } from "@/lib/league-utils";

import L1 from "./columns/L1";
import L2 from "./columns/L2";
import CT from "./columns/CT";
import R1 from "./columns/R1";
import R2 from "./columns/R2";

const ScBottom = () => {
    const { gameData } = useLeagueData();

    const teams = useMemo(() => getTeamData(gameData), [gameData]);

    if (!teams) return null;
    const l2Data = useMemo(() => {
        if (!gameData?.tabs) return null;
        return mapTabsToL2(gameData.tabs);
    }, [gameData]);
    return (
        <div className="min-h-screen flex items-end justify-center">

            <div className="w-[990px] h-[260px] flex bg-black">

                {/* L1 */}
                <L1 />

                {/* L2 */}
                <L2
                    tabs={l2Data?.order}
                    boards={teams.blue.board}
                />

                {/* CENTER */}
                <CT />

                {/* R1 */}
                <R1
                    tabs={l2Data?.chaos}
                    boards={teams.red.board}
                />

                {/* R2 */}
                <R2 />

            </div>

        </div>
    );
};

export default ScBottom;