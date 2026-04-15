import { ItemSlot } from "./ItemSlot";
import { IMAGE_BASE_URL } from "@/lib/league-utils";

export const LoadoutSection = ({ side, mainItems, roleQuest, trinket, perks }) => {
  const isLeft = side === "left";
  
  return (
    <div className={`flex items-center gap-2 px-3 w-[240px] flex-shrink-0 ${isLeft ? 'justify-start' : 'justify-start flex-row-reverse'}`}>
      {/* 6 Main Items */}
      <div className={`flex gap-0.5 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
        {mainItems.map((item, i) => <ItemSlot key={i} item={item} />)}
      </div>

      {/* Quest & Trinket */}
      <div className={`flex items-center gap-0.5 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
        <ItemSlot item={roleQuest} isQuest />
        <ItemSlot item={trinket} isTrinket />
      </div>

      {/* Perks */}
      <div className={`flex flex-col gap-0.5 opacity-60 ${isLeft ? 'items-start' : 'items-end'}`}>
        <img src={`${IMAGE_BASE_URL}${perks?.[0]?.iconPath}`} className="w-3.5 h-3.5 rounded-full border border-black/20" alt="" />
        <img src={`${IMAGE_BASE_URL}${perks?.[1]?.iconPath}`} className="w-3.5 h-3.5 rounded-full border border-black/20" alt="" />
      </div>
    </div>
  );
};