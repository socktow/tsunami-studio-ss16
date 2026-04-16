import { useMemo } from 'react';
import { IdentitySection } from "./IdentitySection";
import { LoadoutSection } from "./LoadoutSection";
import { StatsSection } from "./StatsSection";
import { ITEM_SLOTS, getPercentage, findItemBySlot } from "@/lib/league-utils";

export const PlayerRow = ({ side, playerTab, playerBoard }) => {
  if (!playerTab || !playerBoard) return null;
  const isLeft = side === "left";

  const mainItems = useMemo(() => 
    ITEM_SLOTS.MAIN.map(s => findItemBySlot(playerBoard.items, s)), 
    [playerBoard.items]
  );

  const trinket = findItemBySlot(playerBoard.items, ITEM_SLOTS.TRINKET);
  const roleQuest = findItemBySlot(playerBoard.items, ITEM_SLOTS.QUEST);
  
  const hpPct = getPercentage(playerTab.health?.current, playerTab.health?.max);
  const mpPct = getPercentage(playerTab.resource?.current, playerTab.resource?.max);

  return (
    <div className={`relative flex items-center h-[60px] w-full border-b border-white/[0.03] justify-between`}>
      
      {/* LEFT SIDE */}
      {isLeft && (
        <>
          <LoadoutSection side="left" mainItems={mainItems} roleQuest={roleQuest} trinket={trinket} perks={playerTab.perks} />
          <IdentitySection side="left" playerTab={playerTab} hpPct={hpPct} mpPct={mpPct} />
          <StatsSection isLeft kills={playerBoard.kills} deaths={playerBoard.deaths} assists={playerBoard.assists} creepScore={playerBoard.creepScore} />
        </>
      )}

      {/* RIGHT SIDE */}
      {!isLeft && (
        <>
          <StatsSection kills={playerBoard.kills} deaths={playerBoard.deaths} assists={playerBoard.assists} creepScore={playerBoard.creepScore} />
          <IdentitySection side="right" playerTab={playerTab} hpPct={hpPct} mpPct={mpPct} />
          <LoadoutSection side="right" mainItems={mainItems} roleQuest={roleQuest} trinket={trinket} perks={playerTab.perks} />
        </>
      )}
    </div>
  );
};
