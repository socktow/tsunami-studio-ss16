export default function TopScoreboard() {
  // Cấu hình ván đấu: "Bo1", "Bo3", hoặc "Bo5"
  const matchType = "Bo5";
  const teamAWin = 1;
  const teamBWin = 2;

  const isBo1 = matchType === "Bo1";
  const isBo3 = matchType === "Bo3";
  const isBo5 = matchType === "Bo5";

  const winDots = isBo5 ? [1, 2, 3] : isBo3 ? [1, 2] : [];

  // Chiều cao thanh thắng: Bo3 (1/2 scoreboard), Bo5 (2/5 scoreboard)
  const containerHeight = isBo3 ? "h-10" : "h-8";

  return (
    <div className="absolute top-0 left-0 w-full flex justify-center pointer-events-none mt-4 font-sans select-none">
      {/* Container chính */}
      <div className="flex items-center bg-black/95 text-white px-8 py-3 shadow-2xl border-b-2 border-yellow-500 scale-110 relative h-20">
        {/* --- DẢI MÀU BIÊN --- */}
        <div className="absolute left-1 top-1 bottom-1 w-1.5 bg-yellow-500 rounded-sm" />
        <div className="absolute right-1 top-1 bottom-1 w-1.5 bg-red-600 rounded-sm" />

        {/* --- LEFT SIDE (TEAM A) --- */}
        <div className="flex items-center h-full">
          {/* Win Indicators Team A */}
          {!isBo1 && (
            <div
              className={`flex flex-col justify-center space-y-2 mr-4 ${containerHeight}`}
            >
              {winDots.map((dot) => (
                <div
                  key={dot}
                  className={`w-2 h-6 transition-all duration-500 rounded-[1px] ${
                    dot <= teamAWin
                      ? "bg-yellow-400 shadow-[0_0_8px_#facc15]"
                      : "bg-zinc-800"
                  }`}
                  /* Ghi chú: Đã bỏ flex-1, dùng h-1.5 (6px) hoặc h-2 (8px) tùy bạn chọn */
                />
              ))}
            </div>
          )}

          {/* Team Info */}
          <div className="flex flex-col items-end mr-4 leading-none">
            <span className="font-black text-xl uppercase tracking-tighter">
              Team A
            </span>
            <span className="text-[10px] font-bold text-gray-500 mt-1 italic">
              RANK 2-1
            </span>
          </div>

          {/* Logo Team A */}
          <div className="p-1 rounded-sm shadow-sm ring-1 ring-zinc-800 flex-shrink-0 bg-zinc-900">
            <img
              src="https://s-qwer.op.gg/images/lol/teams/632_1672191537262.png"
              alt="logo"
              className="w-10 h-10 object-contain"
            />
          </div>

          {/* Stats Left */}
          <div className="flex items-center ml-6 space-x-6 border-r border-zinc-800 pr-8 h-8">
            <div className="text-center">
              <p className="text-[9px] font-bold text-zinc-500 uppercase">
                Turrets
              </p>
              <p className="font-bold text-base leading-none">5</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] font-bold text-zinc-500 uppercase">
                Gold
              </p>
              <p className="font-bold text-base text-yellow-400 leading-none">
                45.2k
              </p>
            </div>
          </div>
        </div>

        {/* --- CENTER SECTION (SCORE & TIMER) --- */}
        <div className="flex items-center space-x-6 px-8 h-full">
          <span className="text-4xl font-black tabular-nums tracking-tighter w-12 text-right">
            12
          </span>

          <div className="flex flex-col items-center justify-center min-w-[60px] border-x border-zinc-800 px-4 h-10">
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
              Live
            </span>
            <span className="text-sm font-bold text-yellow-500 font-mono">
              24:15
            </span>
          </div>

          <span className="text-4xl font-black tabular-nums tracking-tighter w-12 text-left">
            10
          </span>
        </div>

        {/* --- RIGHT SIDE (TEAM B) --- */}
        <div className="flex items-center h-full">
          {/* Stats Right */}
          <div className="flex items-center mr-6 space-x-6 border-l border-zinc-800 pl-8 h-8">
            <div className="text-center">
              <p className="text-[9px] font-bold text-zinc-500 uppercase">
                Gold
              </p>
              <p className="font-bold text-base text-yellow-400 leading-none">
                43.8k
              </p>
            </div>
            <div className="text-center">
              <p className="text-[9px] font-bold text-zinc-500 uppercase">
                Turrets
              </p>
              <p className="font-bold text-base leading-none">4</p>
            </div>
          </div>

          {/* Logo Team B */}
          <div className="p-1 rounded-sm shadow-sm ring-1 ring-zinc-800 flex-shrink-0 bg-zinc-900">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/T1_esports_logo.svg/960px-T1_esports_logo.svg.png"
              alt="logo"
              className="w-10 h-10 object-contain"
            />
          </div>

          {/* Team Info */}
          <div className="flex flex-col items-start ml-4 leading-none">
            <span className="font-black text-xl uppercase tracking-tighter">
              Team B
            </span>
            <span className="text-[10px] font-bold text-gray-500 mt-1 italic">
              RANK 1-2
            </span>
          </div>

          {/* Win Indicators Team B - Sát dải biên */}
          {!isBo1 && (
            <div
              className={`flex flex-col justify-center space-y-1 ml-4 ${containerHeight}`}
            >
              {winDots.map((dot) => (
                <div
                  key={dot}
                  className={`w-1.5 flex-1 transition-all duration-500 rounded-full ${
                    dot <= teamBWin
                      ? "bg-red-500 shadow-[0_0_8px_#ef4444]"
                      : "bg-zinc-800"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
