export const StatsSection = ({
  kills,
  deaths,
  assists,
  creepScore,
  isLeft,
}) => (
  <div
    className={`w-full h-full flex flex-col justify-center gap-[5px] ${isLeft ? "items-end text-right pr-[2px]" : "items-start text-left pl-[2px]"
      }`}
  >

    <div className="text-[15px] font-bold text-amber-400 leading-none">
      {creepScore}
    </div>

    <div className="text-[15px] font-bold text-white leading-none">
      {kills}/{deaths}/{assists}
    </div>

  </div>
);