import { useState, useEffect, useRef } from "react";

const SPECIAL_CASES = {
  Wukong: "MonkeyKing",
  LeBlanc: "Leblanc",
  "Kha'Zix": "Khazix",
  "Cho'Gath": "Chogath",
  "Vel'Koz": "Velkoz",
  "Bel'Veth": "Belveth",
  "Nunu & Willump": "Nunu",
  "Renata Glasc": "Renata",
  "Dr. Mundo": "DrMundo",
};

export const useAllGameData = () => {
  const [allPlayers, setAllPlayers] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const skinDataRef = useRef(null);

  const formatChampName = (name) => {
    let f = name.replace(/[\s'.]/g, "");
    return SPECIAL_CASES[name] || f;
  };

  useEffect(() => {
    const initData = async () => {
      try {
        // 1. Fetch Riot Metadata
        const riotRes = await fetch(
          "https://riot-web-cdn.s3.amazonaws.com/game-data/latest/live/gameData_vi_VN.json"
        );
        const riotData = await riotRes.json();
        skinDataRef.current = riotData.champions;

        // 2. Fetch Game Data
        const res = await fetch("/api/game-data");
        const data = await res.json();

        if (data.allPlayers?.length > 0) {
          const processedPlayers = data.allPlayers.map((player) => {
            const champEntry = Object.values(skinDataRef.current).find(
              (c) =>
                c.name === player.championName ||
                c.alias === player.championName ||
                player.rawChampionName?.includes(c.alias)
            );

            let finalImageID = player.skinID;
            let displayName = player.skinName;

            if (champEntry && champEntry.id) {
              const champIdStr = champEntry.id.toString();
              const fullSkinIDFromGame =
                parseInt(champIdStr) * 1000 + parseInt(player.skinID);

              if (champEntry.skins) {
                const skinList = Object.entries(champEntry.skins)
                  .map(([id, info]) => ({ id: parseInt(id), name: info.name }))
                  .sort((a, b) => a.id - b.id);

                const currentSkinInfo = champEntry.skins[fullSkinIDFromGame.toString()];

                // Logic xử lý Đa sắc (Chroma)
                if (currentSkinInfo && currentSkinInfo.name.includes("(")) {
                  const baseSkin = [...skinList]
                    .reverse()
                    .find((s) => s.id <= fullSkinIDFromGame && !s.name.includes("("));

                  if (baseSkin) {
                    finalImageID = baseSkin.id % 1000;
                  }
                }
              }
            }

            return {
              ...player,
              imageSkinID: finalImageID,
              displayName: displayName,
            };
          });

          // Pre-load images
          const imagePromises = processedPlayers.map((player) => {
            return new Promise((resolve) => {
              const champName = formatChampName(player.championName);
              const skinUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champName}_${player.imageSkinID}.jpg`;
              const img = new Image();
              img.src = skinUrl;
              img.onload = () => resolve(true);
              img.onerror = () => resolve(false);
            });
          });

          await Promise.all(imagePromises);
          setAllPlayers(processedPlayers);
          setTimeout(() => setIsReady(true), 500);
        }
      } catch (err) {
        console.error("Error loading all game data:", err);
      }
    };

    initData();
  }, []);

  return { allPlayers, isReady, formatChampName };
};