import React from "react";
import { motion } from "framer-motion";
import Column from "../base/Column";
import { IMAGE_BASE_URL, ITEM_SLOTS } from "@/lib/constants";

// Variants cho container cha
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04, // Mỗi ô cách nhau 0.04s
    },
  },
};

// Variants cho từng ô item
const itemVariants = {
  hidden: { y: 5, opacity: 0, scale: 0.8 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 20 }
  },
};

const L1 = ({ tabs, boards }) => {
  return (
    <Column
      renderCell={(i) => {
        const playerTab = tabs?.[i];
        const playerBoard = boards?.[i];

        const primaryPerk = playerTab?.perks?.[0];
        const items = playerBoard?.items || [];
        const visionScore = playerBoard?.visionScore || 0;

        const mainItemsSorted = items
          .filter((it) => ITEM_SLOTS.MAIN.includes(it.slot))
          .sort((a, b) => (b.cost || 0) - (a.cost || 0));

        const trinketItem = items.find((it) => it.slot === ITEM_SLOTS.TRINKET);
        const questItem = items.find((it) => it.slot === ITEM_SLOTS.QUEST);

        const finalDisplay = [
          { item: questItem, isTrinket: false, num: 8 },
          { item: trinketItem, isTrinket: true, num: 7 },
          ...Array.from({ length: 6 }).map((_, idx) => {
            const displayNum = 6 - idx;
            const itemIndex = mainItemsSorted.length - displayNum;
            const currentItem = itemIndex >= 0 ? mainItemsSorted[itemIndex] : null;
            return { item: currentItem, isTrinket: false, num: displayNum };
          }),
        ];

        return (
          <div className="flex items-center w-full h-full px-1 justify-between">
            {/* GRID ITEMS CÓ ANIMATION */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-[3px]"
            >
              {finalDisplay.map((slot, index) => {
                const item = slot.item;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="relative w-[21px] h-[21px] bg-zinc-900 border border-zinc-700 flex items-center justify-center rounded-[2px] overflow-visible"
                  >
                    {item ? (
                      <>
                        <img
                          src={`${IMAGE_BASE_URL}${item.assetUrl}`}
                          className="w-full h-full object-cover"
                          alt={item.displayName}
                        />
                        {slot.isTrinket && (
                          <div className="absolute inset-x-0 top-0 flex justify-center">
                            <span className="text-[12px] text-base font-medium
                                            bg-black/50  text-white -translate-y-1/2 tracking-wide drop-shadow-lg">
                              {Math.round(visionScore)}
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="text-[7px] font-black text-zinc-700 leading-none">
                        {slot.num}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Cột 9 - 10 (Ngọc và Phụ trợ) */}
            <motion.div
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col gap-[3px]"
            >
              <div className="w-[16px] h-[16px] bg-zinc-900 flex items-center justify-center rounded-[2px] overflow-hidden border border-white/5">
                {primaryPerk?.iconPath ? (
                  <img
                    src={`${IMAGE_BASE_URL}${primaryPerk.iconPath}`}
                    className="w-full h-full object-cover scale-110"
                    alt="perk"
                  />
                ) : (
                  <span className="text-[9px] font-bold text-zinc-500 italic">9</span>
                )}
              </div>
              <div className="w-[16px] h-[16px] bg-zinc-600 border border-zinc-500 flex items-center justify-center rounded-[2px]">
                <span className="text-[9px] font-bold text-white leading-none">10</span>
              </div>
            </motion.div>
          </div>
        );
      }}
    />
  );
};

export default L1;