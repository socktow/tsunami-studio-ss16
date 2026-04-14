import React from 'react';
import { useLeagueData } from "@/app/overlay/layout";

const IMAGE_BASE_URL = "http://localhost:58869/";

const PlayerRow = ({ side, playerTab, playerBoard, index }) => {
  if (!playerTab || !playerBoard) return null;

  const isLeft = side === "left";
  const isDead = playerTab.timeToRespawn > 0;
  const rowBg = index % 2 === 0 ? 'bg-zinc-900/40' : 'bg-transparent';
  const deadOverlay = isDead ? 'grayscale opacity-70' : '';

  const {
    playerName, championAssets, level, health, resource, experience, perks, abilities, timeToRespawn
  } = playerTab;

  const {
    kills, deaths, assists, creepScore, items
  } = playerBoard;

  // Logic lấy Spells từ abilities slot 4 (D) và 5 (F)
  const spellD = abilities?.[4];
  const spellF = abilities?.[5];

  const hpPercent = health ? Math.max(0, Math.min(100, (health.current / health.max) * 100)) : 0;
  const manaPercent = resource ? Math.max(0, Math.min(100, (resource.current / resource.max) * 100)) : 0;
  const xpPercent = experience ? Math.max(0, Math.min(100, (experience.current / experience.nextLevel) * 100)) : 0;

  return (
    <div className={`flex items-center ${rowBg} h-[54px] border-b border-zinc-800/60 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>

      {/* 1. ITEMS & RUNES */}
      <div className={`w-[195px] flex items-center gap-1.5 px-3 ${isLeft ? 'flex-row' : 'flex-row-reverse'} ${deadOverlay}`}>
        {/* Items Grid */}
        <div className="flex gap-[1px]">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-[22px] h-[22px] bg-zinc-950 border border-zinc-800 rounded-sm overflow-hidden shadow-inner">
              {items?.[i]?.squareImg && (
                <img src={`${IMAGE_BASE_URL}${items[i].squareImg}`} className="w-full h-full object-cover" />
              )}
            </div>
          ))}
        </div>
        
        {/* Trinket */}
        <div className="w-[22px] h-[22px] bg-zinc-900 border border-zinc-700/50 rounded-sm flex-shrink-0 overflow-hidden shadow-sm">
          {items?.[6]?.squareImg && <img src={`${IMAGE_BASE_URL}${items[6].squareImg}`} className="w-full h-full object-cover" />}
        </div>

        {/* RUNES (PERKS) - Lấy từ iconPath */}
        <div className="flex flex-col gap-[2px] justify-center items-center px-1">
          <div className="w-[18px] h-[18px] bg-zinc-900 rounded-full border border-yellow-500/20 overflow-hidden">
            {perks?.[0]?.iconPath && <img src={`${IMAGE_BASE_URL}${perks[0].iconPath}`} className="w-full h-full scale-110 object-contain" />}
          </div>
          <div className="w-[14px] h-[14px] bg-zinc-950 rounded-full border border-zinc-700 overflow-hidden">
            {perks?.[1]?.iconPath && <img src={`${IMAGE_BASE_URL}${perks[1].iconPath}`} className="w-full h-full p-[1px] object-contain" />}
          </div>
        </div>
      </div>

      {/* SEPARATOR */}
      <div className="w-[1px] h-8 bg-zinc-700/30 flex-shrink-0" />

      {/* 2. CỤM TRUNG TÂM & INFO */}
      <div className={`flex-1 flex items-center gap-3 px-3 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
        
        {/* SUMMONER SPELLS - Có hỗ trợ Cooldown */}
        <div className={`flex flex-col gap-[1.5px] flex-shrink-0 ${deadOverlay}`}>
          {[spellD, spellF].map((spell, i) => {
            const hasCooldown = spell?.cooldown > 0;
            return (
              <div key={i} className="relative w-[18px] h-[18px] bg-zinc-900 rounded-sm border border-zinc-700 overflow-hidden shadow-sm">
                {spell?.iconPath && <img src={`${IMAGE_BASE_URL}${spell.iconPath}`} className="w-full h-full object-cover" />}
                {hasCooldown && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <span className="text-[9px] font-black text-white leading-none">{Math.ceil(spell.cooldown)}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Avatar Champion */}
        <div className="relative w-10 h-10 border border-zinc-700 bg-zinc-900 flex-shrink-0 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
          <img src={`${IMAGE_BASE_URL}${championAssets?.squareImg}`} className={`w-full h-full object-cover ${isDead ? 'grayscale' : ''}`} />
          <div className={`absolute -bottom-1 ${isLeft ? '-left-1' : '-right-1'} bg-zinc-950 text-[9px] px-1 border border-zinc-700 z-10 font-black text-white`}>{level}</div>
          {isDead && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-20">
              <span className="text-rose-500 text-[13px] font-black">{Math.ceil(timeToRespawn)}</span>
            </div>
          )}
        </div>

        {/* Name & Status Bars */}
        <div className={`flex flex-col justify-center min-w-0 ${isLeft ? 'items-start' : 'items-end'}`}>
          <span className={`text-[10px] font-black uppercase tracking-tighter mb-1 leading-none truncate w-24 ${isDead ? 'text-zinc-600' : 'text-zinc-100'}`}>
            {playerName}
          </span>
          
          <div className="flex flex-col gap-[2px] w-20">
            {/* HP Bar */}
            <div className="h-1.5 w-full bg-zinc-950 rounded-[1px] border border-white/5 overflow-hidden flex">
              <div className={`h-full bg-gradient-to-r from-green-600 to-green-400 ${!isLeft ? 'ml-auto' : ''}`} style={{ width: `${hpPercent}%` }} />
            </div>
            {/* Resource Bar (Mana/Energy) */}
            <div className="h-1 w-full bg-zinc-950 rounded-[1px] border border-white/5 overflow-hidden flex">
              <div className={`h-full ${resource?.type === 'energy' ? 'bg-yellow-400' : 'bg-blue-500'} ${!isLeft ? 'ml-auto' : ''}`} style={{ width: `${manaPercent}%` }} />
            </div>
            {/* XP Bar */}
            <div className={`h-[2px] w-[80%] bg-zinc-950/50 rounded-full overflow-hidden flex ${isLeft ? 'justify-start' : 'justify-end'}`}>
              <div className="h-full bg-purple-500 shadow-[0_0_4px_rgba(168,85,247,0.4)]" style={{ width: `${xpPercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. ECONOMY & COMBAT */}
      <div className={`w-[90px] flex flex-col justify-center px-3 ${isLeft ? 'items-end' : 'items-start'} ${deadOverlay}`}>
        <div className="text-[13px] font-black text-yellow-500 font-mono leading-none tracking-tight">{creepScore}</div>
        <div className={`flex items-center gap-1 whitespace-nowrap text-[11px] font-black tracking-tighter mt-1`}>
          <span className="text-zinc-100">{kills}</span>
          <span className="text-zinc-600 opacity-40">/</span>
          <span className="text-rose-500/90">{deaths}</span>
          <span className="text-zinc-600 opacity-40">/</span>
          <span className="text-zinc-100">{assists}</span>
        </div>
      </div>
    </div>
  );
};

const GoldIndicator = ({ bluePlayer, redPlayer }) => {
  const diff = (bluePlayer?.totalGold || 0) - (redPlayer?.totalGold || 0);
  const absDiff = Math.abs(diff);
  const isBlueLeading = diff > 0;
  const isRedLeading = diff < 0;

  return (
    <div className="h-[54px] w-16 flex items-center justify-center relative bg-zinc-950 border-b border-zinc-800/40 shadow-inner">
      <div className={`absolute inset-y-0 w-1 ${isBlueLeading ? 'left-0 bg-cyan-500/40' : isRedLeading ? 'right-0 bg-rose-500/40' : ''}`} />
      <div className={`text-[10px] font-black tracking-tighter z-10 font-mono ${isBlueLeading ? 'text-cyan-400' : isRedLeading ? 'text-rose-500' : 'text-zinc-600'}`}>
        {absDiff !== 0 ? (absDiff >= 1000 ? `${(absDiff/1000).toFixed(1)}k` : absDiff) : "—"}
      </div>
    </div>
  );
};

export default function ScoreboardOverlayFinal() {
  const { gameData } = useLeagueData();
  if (!gameData || !gameData.tabs || !gameData.scoreboardBottom) return null;

  const blueTeamTabs = gameData.tabs.Order.players;
  const redTeamTabs = gameData.tabs.Chaos.players;
  const blueTeamBoard = gameData.scoreboardBottom.teams[0].players;
  const redTeamBoard = gameData.scoreboardBottom.teams[1].players;

  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-center select-none font-sans scale-[0.95] origin-bottom pb-4">
      <div className="flex items-stretch bg-[#0a0a0c]/98 border border-zinc-800/80 shadow-[0_0_60px_rgba(0,0,0,1)] rounded-t-2xl overflow-hidden">
        
        {/* TEAM LEFT */}
        <div className="flex flex-col w-[480px]">
          {blueTeamTabs.map((p, idx) => (
            <PlayerRow key={`blue-${idx}`} side="left" playerTab={p} playerBoard={blueTeamBoard[idx]} index={idx} />
          ))}
        </div>

        {/* GOLD INDICATOR CENTER */}
        <div className="flex flex-col border-x border-zinc-800/60">
          {blueTeamBoard.map((p, idx) => (
            <GoldIndicator key={`gold-${idx}`} bluePlayer={p} redPlayer={redTeamBoard[idx]} />
          ))}
        </div>

        {/* TEAM RIGHT */}
        <div className="flex flex-col w-[480px]">
          {redTeamTabs.map((p, idx) => (
            <PlayerRow key={`red-${idx}`} side="right" playerTab={p} playerBoard={redTeamBoard[idx]} index={idx} />
          ))}
        </div>

      </div>
    </div>
  );
}