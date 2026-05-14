import React from "react";
import { motion } from "framer-motion";
import Column from "../base/Column";
import { IMAGE_BASE_URL, ITEM_SLOTS } from "@/lib/constants";
import { useScoreboardBottomSelector } from "@/hooks/useLeagueSelector";

// --- DANH MỤC NGỌC (UTILS) ---
export const perkcategory = {
  Domination: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7200_Domination.png",
  Precision: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7201_Precision.png",
  Sorcery: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7202_Sorcery.png",
  Whimsy: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7203_Whimsy.png",
  Resolve: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7204_Resolve.png",
};

const groups = {
  [perkcategory.Domination]: [8126, 8139, 8143, 8137, 8140, 8141, 8135, 8105, 8106],
  [perkcategory.Precision]: [9101, 9111, 8009, 9103, 9104, 9105, 8014, 8017, 8299],
  [perkcategory.Sorcery]: [8224, 8226, 8275, 8210, 8233, 8234, 8237, 8236, 8232],
  [perkcategory.Whimsy]: [8306, 8304, 8321, 8313, 8352, 8345, 8347, 8410, 8316],
  [perkcategory.Resolve]: [8446, 8463, 8401, 8429, 8444, 8473, 8451, 8453, 8242]
};

export const perkIdToCategoryImage = Object.entries(groups).reduce((acc, [url, ids]) => {
  ids.forEach(id => { acc[id] = url; });
  return acc;
}, {});

// --- ANIMATIONS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { y: 5, opacity: 0, scale: 0.8 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

const L1 = () => {
  const data = useScoreboardBottomSelector();
  const blueTeam = data?.teams?.[0];

  const renderPlayerContent = (i) => {
    const player = blueTeam?.players?.[i];
    if (!player) return null;

    // Lấy thông tin ngọc phụ (Secondary)
    const secondaryRune = player?.perks?.[4];
    const secondaryRuneStyleUrl = secondaryRune ? perkIdToCategoryImage[secondaryRune.id] : null;

    // LOGIC HỒI SINH
    const gameTime = data?.gameTime || 0;
    const respawnLeft = Math.max(0, Math.ceil((player?.respawnAt || 0) - gameTime));
    const isDead = respawnLeft > 0;

    // XỬ LÝ VẬT PHẨM
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
        
        {/* ITEMS GRID */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-row-reverse items-center gap-[3px]">
          {finalDisplay.map((slot, index) => (
            <motion.div
              key={`blue-${i}-item-${index}`}
              variants={itemVariants}
              className={`relative w-[21px] h-[21px] bg-zinc-900 border rounded-[2px] flex items-center justify-center overflow-visible transition-colors ${isDead ? "border-zinc-800" : "border-zinc-700"}`}
            >
              {slot.item ? (
                <>
                  <img src={`${IMAGE_BASE_URL}${slot.item.assetUrl}`} className="w-full h-full object-cover rounded-[2px]" alt="item" />
                  {(slot.item.stacks > 0 || slot.item.charges > 0) && (
                    <div className="absolute bottom-0 right-0 min-w-[10px] h-[10px] px-[1px] flex items-center justify-center text-[9px] leading-none font-black z-40 shadow-[0_0_4px_rgba(0,0,0,0.9)]" style={{ textShadow: `0 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000` }}>
                      {slot.item.stacks || slot.item.charges}
                    </div>
                  )}
                  {slot.isTrinket && (
                    <>
                      <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 min-w-[12px] h-[9px] flex items-center justify-center text-[11px] leading-none font-bold z-50" style={{ textShadow: `0 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000` }}>
                        {Math.round(visionScore)}
                      </div>
                      <div className={`absolute inset-0 bg-black/10 border pointer-events-none ${isDead ? "border-zinc-500/20" : "border-yellow-500/20"}`} />
                    </>
                  )}
                </>
              ) : null}
            </motion.div>
          ))}
        </motion.div>

        {/* PERKS DISPLAY */}
        <div className="flex flex-col gap-[4px]">
          {/* PRIMARY RUNE (Keystone) */}
          <div className={`w-[17px] h-[17px] rounded-[2px] flex items-center justify-center ${isDead ? "bg-zinc-900" : "bg-zinc-800 border border-white/5"}`}>
            {player?.perks?.[0]?.iconPath ? (
              <img src={`${IMAGE_BASE_URL}${player.perks[0].iconPath}`} alt="primary" className="w-full h-full object-cover scale-110" />
            ) : <div className="w-full h-full bg-zinc-800" />}
          </div>

          {/* SECONDARY RUNE STYLE (The Icon you want to map) */}
          <div className={`w-[17px] h-[17px] flex items-center justify-center ${isDead ? "bg-zinc-900" : "bg-zinc-800 border border-white/5"}`}>
            {secondaryRuneStyleUrl ? (
              <img 
                src={secondaryRuneStyleUrl} 
                alt="secondary-style" 
                className="w-[14px] h-[14px] object-contain opacity-80" 
              />
            ) : (
              <div className="w-full h-full bg-zinc-800" />
            )}
          </div>
        </div>
      </div>
    );
  };

  return <Column renderCell={(i) => renderPlayerContent(i)} />;
};

export default L1;