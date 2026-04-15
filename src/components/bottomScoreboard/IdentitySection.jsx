import { motion } from "framer-motion";
import { IMAGE_BASE_URL } from "@/lib/league-utils";

export const IdentitySection = ({ side, playerTab, hpPct, mpPct }) => {
  const isLeft = side === "left";
  const { playerName, championAssets, level, abilities, timeToRespawn } = playerTab;
  const isDead = timeToRespawn > 0;
  const ulti = abilities?.[3];

  return (
    <div className={`flex items-center gap-2 px-2 w-[260px] flex-shrink-0 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>

      {/* Spells */}
      <div className="flex flex-col gap-0.5">
        {[4, 5].map(idx => (
          <div key={idx} className="w-[28px] h-[28px] rounded-sm border border-black/40 overflow-hidden relative bg-black">
            <img src={`${IMAGE_BASE_URL}${abilities?.[idx]?.assets?.iconAsset}`} className="w-full h-full" />
          </div>
        ))}
      </div>

      {/* Champ */}
      <div className="relative">
        <div className={`w-[50px] h-[50px] rounded-md border overflow-hidden`}>
          <motion.img
            animate={{ filter: isDead ? "grayscale(1) brightness(0.3)" : "none" }}
            src={`${IMAGE_BASE_URL}${championAssets?.squareImg}`}
            className="w-full h-full object-cover"
          />
        </div>

        <div className={`absolute -bottom-1 ${isLeft ? '-left-1' : '-right-1'} text-[10px] bg-black px-1`}>
          {level}
        </div>
      </div>

      {/* Info */}
      <div className={`flex flex-col w-[140px] ${isLeft ? 'items-start' : 'items-end'}`}>

        {/* Name */}
        <div className={`flex items-center gap-1 w-full ${isLeft ? '' : 'flex-row-reverse'}`}>
          {ulti?.assets?.iconAsset && (
            <img src={`${IMAGE_BASE_URL}${ulti.assets.iconAsset}`} className="w-[24px] h-[24px] rounded-full" />
          )}
          <span className={`text-[15px] font-bold truncate w-full ${isLeft ? 'text-left' : 'text-right'}`}>
            {playerName}
          </span>
        </div>

        {/* HP */}
        <div className="w-full mt-1">
          <div className="h-1.5 bg-black/60 rounded overflow-hidden">
            <motion.div
              animate={{ scaleX: hpPct / 100 }}
              style={{ originX: isLeft ? 0 : 1 }}
              className="h-full bg-green-500"
            />
          </div>

          <div className="h-[2px] w-[70%] bg-black/60 mt-[2px] overflow-hidden">
            <motion.div
              animate={{ scaleX: mpPct / 100 }}
              style={{ originX: isLeft ? 0 : 1 }}
              className="h-full bg-blue-400"
            />
          </div>
        </div>

      </div>
    </div>
  );
};