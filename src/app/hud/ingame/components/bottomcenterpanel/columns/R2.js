import React from "react";
import { motion } from "framer-motion";
import Column from "../base/Column";
import { IMAGE_BASE_URL, ITEM_SLOTS } from "@/lib/constants";
import { useScoreboardBottomSelector } from "@/hooks/useLeagueSelector";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 }
  }
};

const itemVariants = {
  hidden: { y: 5, opacity: 0, scale: 0.8 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 20 }
  }
};

const R2 = () => {
  const data = useScoreboardBottomSelector();
  const redTeam = data?.teams?.[1];

  const renderPlayerContent = (i) => {
    const player = redTeam?.players?.[i];
    if (!player) return null;

    // XÁC ĐỊNH TRẠNG THÁI TỬ TRẬN
    const isDead = player?.respawnAt > 0;

    const items = player.items || [];
    const visionScore = player.visionScore || 0;

    const mainItemsSorted = items
      .filter((it) => ITEM_SLOTS.MAIN.includes(it.slot))
      .sort((a, b) => (b.cost || 0) - (a.cost || 0));

    const trinketItem = items.find((it) => it.slot === ITEM_SLOTS.TRINKET);
    const questItem = items.find((it) => it.slot === ITEM_SLOTS.QUEST);

    const finalDisplay = [
      ...Array.from({ length: 6 }).map((_, idx) => ({
        item: mainItemsSorted[idx] || null,
        isTrinket: false,
        num: idx + 1,
      })),
      { item: trinketItem, isTrinket: true, num: 7 },
      { item: questItem, isTrinket: false, num: 8 },
    ];

    return (
      <div className={`flex items-center w-full h-full px-1 justify-between transition-all duration-500 ${isDead ? "grayscale opacity-60" : "opacity-100"}`}>
        
        {/* PERK & VISION (Nằm bên trái cho R2) */}
        <div className="flex flex-col gap-[3px]">
          <div className={`w-[16px] h-[16px] rounded-[2px] overflow-hidden flex items-center justify-center border transition-colors ${isDead ? "bg-zinc-900 border-white/5" : "bg-zinc-800 border-white/5"}`}>
            {player.perkIcon ? (
              <img 
                src={`${IMAGE_BASE_URL}${player.perkIcon}`} 
                alt="perk" 
                className="w-full h-full object-cover scale-110" 
              />
            ) : (
              <div className="w-full h-full bg-zinc-800" />
            )}
          </div>
          <div className={`w-[16px] h-[16px] rounded-[2px] flex items-center justify-center border transition-colors ${isDead ? "bg-zinc-800 border-zinc-700" : "bg-zinc-700 border-zinc-600"}`}>
            <span className={`text-[8px] font-bold transition-colors ${isDead ? "text-zinc-500" : "text-zinc-300"}`}>
              {Math.round(visionScore)}
            </span>
          </div>
        </div>

        {/* ITEMS GRID (Nằm bên phải cho R2) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-[3px]"
        >
          {finalDisplay.map((slot, index) => (
            <motion.div
              key={`${i}-item-${index}`}
              variants={itemVariants}
              className={`relative w-[21px] h-[21px] bg-zinc-900 border rounded-[2px] flex items-center justify-center overflow-hidden transition-colors ${isDead ? "border-zinc-800" : "border-zinc-700"}`}
            >
              {slot.item ? (
                <React.Fragment>
                  <img
                    src={`${IMAGE_BASE_URL}${slot.item.assetUrl}`}
                    className="w-full h-full object-cover"
                    alt="item"
                  />
                  {slot.isTrinket && (
                    <div className={`absolute inset-0 bg-black/10 border pointer-events-none ${isDead ? "border-zinc-500/10" : "border-yellow-500/20"}`} />
                  )}
                </React.Fragment>
              ) : (
                <span className={`text-[7px] font-bold transition-colors ${isDead ? "text-zinc-700" : "text-zinc-500"}`}>
                  {slot.num}
                </span>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  };

  return (
    <Column
      renderCell={(i) => renderPlayerContent(i)}
    />
  );
};

export default R2;