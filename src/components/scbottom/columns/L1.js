import React from "react";
import Column from "../base/Column";
import { IMAGE_BASE_URL, ITEM_SLOTS } from "@/lib/constants";

const L1 = ({ tabs, boards }) => {
  return (
    <Column
      renderCell={(i) => {
        const playerTab = tabs?.[i];
        const playerBoard = boards?.[i];

        const primaryPerk = playerTab?.perks?.[0];
        const items = playerBoard?.items || [];
        const visionScore = playerBoard?.visionScore || 0;

        // --- LOGIC SẮP XẾP ---
        // Sắp xếp Giảm dần: Món đắt nhất ở đầu mảng (Index 0)
        const mainItemsSorted = items
          .filter((it) => ITEM_SLOTS.MAIN.includes(it.slot))
          .sort((a, b) => (b.cost || 0) - (a.cost || 0));

        const trinketItem = items.find((it) => it.slot === ITEM_SLOTS.TRINKET);
        const questItem = items.find((it) => it.slot === ITEM_SLOTS.QUEST);

        // --- TẠO MẢNG HIỂN THỊ (8 -> 1) ---
        const finalDisplay = [
          { item: questItem, isTrinket: false, num: 8 },
          { item: trinketItem, isTrinket: true, num: 7 },
          
          // Logic 6 ô chính: Ưu tiên lấp đầy từ ô số 1 (bên phải) trước
          ...Array.from({ length: 6 }).map((_, idx) => {
            const displayNum = 6 - idx; // Số hiển thị trên UI: 6, 5, 4, 3, 2, 1
            
            /**
             * Giải thuật:
             * Nếu có 2 món đồ: mainItemsSorted.length = 2
             * Ô số 1 (idx=5): Cần lấy item đắt nhất (mainItemsSorted[0])
             * Ô số 2 (idx=4): Cần lấy item đắt nhì (mainItemsSorted[1])
             * Các ô còn lại: null
             */
            const itemIndex = mainItemsSorted.length - displayNum;
            const currentItem = itemIndex >= 0 ? mainItemsSorted[itemIndex] : null;

            return {
              item: currentItem,
              isTrinket: false,
              num: displayNum,
            };
          }),
        ];

        return (
          <div className="flex items-center w-full h-full px-1 justify-between">
            {/* GRID ITEMS: 8 7 [Trống] [Trống] [Trống] [Trống] [Item 2] [Item 1] */}
            <div className="flex items-center gap-[3px]">
              {finalDisplay.map((slot, index) => {
                const item = slot.item;

                return (
                  <div
                    key={index}
                    className="relative w-[21px] h-[21px] bg-zinc-900 border border-zinc-700 flex items-center justify-center rounded-[2px] overflow-hidden"
                  >
                    {item ? (
                      <>
                        <img
                          src={`${IMAGE_BASE_URL}${item.assetUrl}`}
                          className="w-full h-full object-cover"
                          alt={item.displayName}
                        />
                        {slot.isTrinket && (
                          <div className="absolute inset-0 flex justify-center items-start pt-[0.25px]">
                            <span className="text-[10px] font-black leading-none bg-black/80 text-white px-[2px] py-[0.5px] shadow-sm">
                              {Math.round(visionScore)}
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="text-[7px] font-black text-zinc-700 leading-none">
                        {slot.num}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Cột 9 - 10 */}
            <div className="flex flex-col gap-[3px]">
              <div className="w-[16px] h-[16px] bg-zinc-900 flex items-center justify-center rounded-[2px] overflow-hidden border border-white/5">
                {primaryPerk?.iconPath ? (
                  <img
                    src={`${IMAGE_BASE_URL}${primaryPerk.iconPath}`}
                    className="w-full h-full object-cover scale-110"
                    alt="perk"
                  />
                ) : (
                  <span className="text-[9px] font-bold text-zinc-500 italic">9</span>
                )}
              </div>
              <div className="w-[16px] h-[16px] bg-zinc-600 border border-zinc-500 flex items-center justify-center rounded-[2px]">
                <span className="text-[9px] font-bold text-white leading-none">10</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
};

export default L1;