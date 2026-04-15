import { motion, AnimatePresence } from "framer-motion";
import { IMAGE_BASE_URL } from "@/lib/league-utils";

export const ItemSlot = ({ item, isQuest = false, isTrinket = false }) => (
  <motion.div 
    layout
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className={`
      relative flex-shrink-0 rounded-[2px] overflow-hidden bg-black/40 border backdrop-blur-md
      ${isQuest ? 'w-[24px] h-[24px] border-blue-400/30' : 
        isTrinket ? 'w-[20px] h-[20px] border-amber-400/20' : 
        'w-[22px] h-[22px] border-white/5'}
    `}
  >
    <AnimatePresence mode="wait">
      {item?.assetUrl && (
        <motion.img 
          key={item.assetUrl}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          src={`${IMAGE_BASE_URL}${item.assetUrl}`} 
          className="w-full h-full object-cover" 
        />
      )}
    </AnimatePresence>
  </motion.div>
);