import React from "react";
import { motion } from "framer-motion";
import Column from "../base/Column";

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
  },
};

const L1 = () => {
  const fakeItems = Array.from({ length: 8 });

  return (
    <Column
      renderCell={(i) => {
        return (
          <div className="flex items-center w-full h-full px-1 justify-between">
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-[3px]"
            >
              {fakeItems.map((_, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="w-[21px] h-[21px] bg-zinc-900 border border-zinc-700 rounded-[2px]"
                >
                  <div className="w-full h-full flex items-center justify-center text-[8px] text-zinc-500">
                    {index + 1}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* perks mock */}
            <div className="flex flex-col gap-[3px]">
              <div className="w-[16px] h-[16px] bg-zinc-800" />
              <div className="w-[16px] h-[16px] bg-zinc-700" />
            </div>

          </div>
        );
      }}
    />
  );
};

export default L1;