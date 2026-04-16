export const IdentitySection = ({ side, playerTab, hpPct, mpPct }) => {
  const isLeft = side === "left";
  const { playerName, championAssets, level, abilities, timeToRespawn } = playerTab;
  const isDead = timeToRespawn > 0;
  const ulti = abilities?.[3];

  return (
    <div
      className={`flex items-center w-[260px] flex-shrink-0 gap-[6px] ${
        isLeft ? "flex-row" : "flex-row-reverse"
      }`}
    >

      {/* Spells */}
      <div className="flex flex-col gap-[2px]">
        {[4, 5].map(idx => (
          <div
            key={idx}
            className="w-[26px] h-[26px] rounded-sm overflow-hidden border border-white/10 bg-black"
          >
            <img
              src={`${IMAGE_BASE_URL}${abilities?.[idx]?.assets?.iconAsset}`}
              className="w-full h-full"
            />
          </div>
        ))}
      </div>

      {/* Champion */}
      <div className="relative">
        <div className="w-[48px] h-[48px] rounded-md overflow-hidden border border-white/10">
          <motion.img
            animate={{
              filter: isDead ? "grayscale(1) brightness(0.3)" : "none",
            }}
            src={`${IMAGE_BASE_URL}${championAssets?.squareImg}`}
            className="w-full h-full object-cover"
          />
        </div>

        <div
          className={`absolute -bottom-1 text-[10px] bg-black px-1 ${
            isLeft ? "-right-1" : "-left-1"
          }`}
        >
          {level}
        </div>
      </div>

      {/* Info */}
      <div
        className={`flex flex-col w-[140px] ${
          isLeft ? "items-start text-left" : "items-end text-right"
        }`}
      >

        {/* Name row */}
        <div
          className={`flex items-center gap-[4px] w-full ${
            isLeft ? "" : "flex-row-reverse"
          }`}
        >
          {ulti?.assets?.iconAsset && (
            <img
              src={`${IMAGE_BASE_URL}${ulti.assets.iconAsset}`}
              className="w-[20px] h-[20px] rounded-full"
            />
          )}

          <span className="text-[14px] font-bold truncate">
            {playerName}
          </span>
        </div>

        {/* HP bar */}
        <div className="w-full mt-[2px]">
          <div className="h-1.5 bg-black/70 rounded overflow-hidden">
            <motion.div
              animate={{ scaleX: hpPct / 100 }}
              style={{ originX: isLeft ? 0 : 1 }}
              className="h-full bg-green-500"
            />
          </div>

          <div className="h-[2px] w-[70%] bg-black/70 mt-[2px] overflow-hidden">
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