import React from "react";
import { motion } from "framer-motion";
import Column from "../base/Column";

// Variants giữ nguyên để test animation UI
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
  const TEST_ITEMS = Array.from({ length: 8 });

  return (
    <Column
      renderCell={(i) => {
        return (
          <div className="flex items-center w-full h-full px-1 justify-between">

            {/* LEFT (PERK MOCK) */}
            <div className="flex flex-col gap-[3px]">
              <div className="w-[16px] h-[16px] bg-zinc-800 rounded-[2px]" />
              <div className="w-[16px] h-[16px] bg-zinc-700 rounded-[2px]" />
            </div>

            {/* ITEMS GRID */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-[3px]"
            >
              {TEST_ITEMS.map((_, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="w-[21px] h-[21px] bg-zinc-900 border border-zinc-700 rounded-[2px] flex items-center justify-center"
                >
                  <span className="text-[7px] text-zinc-500 font-bold">
                    {index + 1}
                  </span>
                </motion.div>
              ))}
            </motion.div>

          </div>
        );
      }}
    />
  );
};

export default R2;