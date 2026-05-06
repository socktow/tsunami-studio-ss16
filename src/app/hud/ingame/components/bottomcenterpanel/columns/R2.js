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

  // Tách logic render ra hàm riêng để tránh lỗi "Expression expected" khi lồng callback quá sâu
  const renderPlayerContent = (i) => {
    const player = redTeam?.players?.[i];
    if (!player) return null;

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
      <div className="flex items-center w-full h-full px-1 justify-between">
        {/* PERK & VISION */}
        <div className="flex flex-col gap-[3px]">
          <div className="w-[16px] h-[16px] bg-zinc-800 rounded-[2px] overflow-hidden flex items-center justify-center border border-white/5">
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
          <div className="w-[16px] h-[16px] bg-zinc-700 rounded-[2px] flex items-center justify-center border border-zinc-600">
            <span className="text-[8px] font-bold text-zinc-300">
              {Math.round(visionScore)}
            </span>
          </div>
        </div>

        {/* ITEMS GRID */}
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
              className="relative w-[21px] h-[21px] bg-zinc-900 border border-zinc-700 rounded-[2px] flex items-center justify-center overflow-hidden"
            >
              {slot.item ? (
                <React.Fragment>
                  <img
                    src={`${IMAGE_BASE_URL}${slot.item.assetUrl}`}
                    className="w-full h-full object-cover"
                    alt="item"
                  />
                  {slot.isTrinket && (
                    <div className="absolute inset-0 bg-black/10 border border-yellow-500/20 pointer-events-none" />
                  )}
                </React.Fragment>
              ) : (
                <span className="text-[7px] text-zinc-500 font-bold">
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