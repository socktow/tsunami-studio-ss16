import React from "react";
import { motion } from "framer-motion";
import Column from "../base/Column";
import { IMAGE_BASE_URL, ITEM_SLOTS } from "@/lib/constants";
import { useScoreboardBottomSelector } from "@/hooks/useLeagueSelector";

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
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

const R2 = () => {
  const data = useScoreboardBottomSelector();
  const redTeam = data?.teams?.[1];

  const renderPlayerContent = (i) => {
    const player = redTeam?.players?.[i];

    if (!player) return null;

    /**
     * RESPAWN LOGIC
     */
    const gameTime = data?.gameTime || 0;

    const respawnLeft = Math.max(
      0,
      Math.ceil((player?.respawnAt || 0) - gameTime)
    );

    const isDead = respawnLeft > 0;

    const items = player.items || [];
    const visionScore = player.visionScore || 0;

    /**
     * SORT ITEMS
     */
    const mainItemsSorted = items
      .filter((it) => ITEM_SLOTS.MAIN.includes(it.slot))
      .sort((a, b) => (b.cost || 0) - (a.cost || 0));

    const trinketItem = items.find(
      (it) => it.slot === ITEM_SLOTS.TRINKET
    );

    const questItem = items.find(
      (it) => it.slot === ITEM_SLOTS.QUEST
    );

    const finalDisplay = [
      ...Array.from({ length: 6 }).map((_, idx) => ({
        item: mainItemsSorted[idx] || null,
        isTrinket: false,
        num: idx + 1,
      })),

      {
        item: trinketItem,
        isTrinket: false,
        num: 7,
      },

      {
        item: questItem,
        isTrinket: true,
        num: 8,
      },
    ];

    return (
      <div
        className={`
          flex items-center w-full h-full px-1
          justify-between transition-all duration-500
          ${isDead ? "grayscale opacity-60" : "opacity-100"}
        `}
      >
        {/* PERKS */}
        <div className="flex flex-col gap-[4px]">
          {/* PRIMARY RUNE */}
          <div
            className={`
              w-[17px] h-[17px]
              flex items-center justify-center
              ${
                isDead
                  ? "bg-zinc-900 border-white/5"
                  : "bg-zinc-800 border-white/5"
              }
            `}
          >
            {player?.perks?.[0]?.iconPath ? (
              <img
                src={`${IMAGE_BASE_URL}${player.perks[0].iconPath}`}
                alt="primary-perk"
                className="w-full h-full object-cover scale-110"
              />
            ) : (
              <div className="w-full h-full bg-zinc-800" />
            )}
          </div>

          {/* SECONDARY RUNE */}
          <div
            className={`
              w-[17px] h-[17px]
              flex items-center justify-center
              ${
                isDead
                  ? "bg-zinc-900 border-zinc-800"
                  : "bg-zinc-800 border-white/5"
              }
            `}
          >
            {player?.perks?.[4]?.iconPath ? (
              <img
                src={`${IMAGE_BASE_URL}${player.perks[4].iconPath}`}
                alt="secondary-perk"
                className="w-full h-full object-cover scale-110"
              />
            ) : (
              <div className="w-full h-full bg-zinc-800" />
            )}
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
              className={`
                relative w-[21px] h-[21px]
                bg-zinc-900 border rounded-[2px]
                flex items-center justify-center
                overflow-visible transition-colors
                ${
                  isDead
                    ? "border-zinc-800"
                    : "border-zinc-700"
                }
              `}
            >
              {slot.item ? (
                <>
                  {/* ITEM IMAGE */}
                  <img
                    src={`${IMAGE_BASE_URL}${slot.item.assetUrl}`}
                    className="w-full h-full object-cover rounded-[2px]"
                    alt="item"
                  />

                  {/* STACK / CHARGES */}
                  {(slot.item.stacks > 0 ||
                    slot.item.charges > 0) && (
                    <div
                      className={`
                        absolute bottom-0 left-0
                        min-w-[10px] h-[10px]
                        px-[1px]
                        flex items-center justify-center
                        bg-black/90
                        rounded-tr-[3px]
                        border-r border-t
                        text-[7px] leading-none font-black
                        shadow-[0_0_4px_rgba(0,0,0,0.9)]
                        z-40
                        ${
                          isDead
                            ? "text-zinc-400 border-zinc-700"
                            : "text-white border-white/10"
                        }
                      `}
                    >
                      {slot.item.stacks ||
                        slot.item.charges}
                    </div>
                  )}

                  {/* TRINKET OVERLAY + VISION SCORE */}
                  {slot.isTrinket && (
                    <>
                      {/* VISION SCORE */}
                      <div
                        className={`
                          absolute -top-[6px]
                          left-1/2 -translate-x-1/2
                          min-w-[12px] h-[9px]
                          px-[2px]
                          flex items-center justify-center
                          text-[13px] leading-none font-bold text-white
                          shadow-[0_0_4px_rgba(0,0,0,0.9)]
                          z-50
                          ${
                            isDead
                              ? "text-zinc-400 border-zinc-700"
                              : "text-cyan-200 border-cyan-500/20"
                          }
                        `}
                      >
                        {Math.round(visionScore)}
                      </div>

                      {/* TRINKET BORDER */}
                      <div
                        className={`
                          absolute inset-0
                          bg-black/10 border
                          pointer-events-none
                          ${
                            isDead
                              ? "border-zinc-500/10"
                              : "border-yellow-500/20"
                          }
                        `}
                      />
                    </>
                  )}
                </>
              ) : (
                <span
                  className={`
                    text-[7px] font-bold transition-colors
                    ${
                      isDead
                        ? "text-zinc-700"
                        : "text-zinc-500"
                    }
                  `}
                >
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