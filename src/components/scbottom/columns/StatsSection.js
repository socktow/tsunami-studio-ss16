export const StatsSection = ({
  kills,
  deaths,
  assists,
  creepScore,
  isLeft,
}) => (
  <div
    className={`w-full h-full flex flex-col justify-center gap-[4px] ${
      isLeft
        ? "items-end text-right pr-[5px]"
        : "items-start text-left pl-[5px]"
    }`}
  >
    <div className="text-[14px] font-semibold text-amber-400 leading-none">
      {creepScore}
    </div>

    <div className="text-[14px] font-semibold text-white leading-none">
      {kills}/{deaths}/{assists}
    </div>
  </div>
);
