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
  const readyTimerRef = useRef(null);

  const formatChampName = (name) => {
    const f = name.replace(/[\s'.]/g, "");
    return SPECIAL_CASES[name] || f;
  };

  useEffect(() => {
    let mounted = true;

    const initData = async () => {
      try {
        const riotRes = await fetch(
          "https://riot-web-cdn.s3.amazonaws.com/game-data/latest/live/gameData_vi_VN.json"
        );

        const riotData = await riotRes.json();

        if (!mounted) return;

        skinDataRef.current = riotData.champions;

        const res = await fetch("/api/game-data");
        const data = await res.json();

        if (!mounted) return;

        if (data.allPlayers?.length > 0) {
          const processedPlayers = data.allPlayers.map((player) => {
            const champEntry = Object.values(
              skinDataRef.current || {}
            ).find(
              (c) =>
                c.name === player.championName ||
                c.alias === player.championName ||
                player.rawChampionName?.includes(c.alias)
            );

            let finalImageID = player.skinID;

            if (champEntry?.skins) {
              const champIdStr = champEntry.id.toString();

              const fullSkinID =
                parseInt(champIdStr) * 1000 +
                parseInt(player.skinID);

              const skinList = Object.entries(
                champEntry.skins
              )
                .map(([id, info]) => ({
                  id: parseInt(id),
                  name: info.name,
                }))
                .sort((a, b) => a.id - b.id);

              const currentSkin =
                champEntry.skins[
                  fullSkinID.toString()
                ];

              if (
                currentSkin &&
                currentSkin.name.includes("(")
              ) {
                const baseSkin = [...skinList]
                  .reverse()
                  .find(
                    (s) =>
                      s.id <= fullSkinID &&
                      !s.name.includes("(")
                  );

                if (baseSkin) {
                  finalImageID = baseSkin.id % 1000;
                }
              }
            }

            return {
              ...player,
              imageSkinID: finalImageID,
              displayName: player.skinName,
            };
          });

          await Promise.all(
            processedPlayers.map((player) => {
              return new Promise((resolve) => {
                const champ =
                  formatChampName(
                    player.championName
                  );

                const img = new Image();

                img.src =
                  `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champ}_${player.imageSkinID}.jpg`;

                img.onload = () => resolve(true);
                img.onerror = () =>
                  resolve(false);
              });
            })
          );

          if (!mounted) return;

          setAllPlayers(processedPlayers);

          readyTimerRef.current =
            setTimeout(() => {
              if (mounted) {
                setIsReady(true);
              }
            }, 500);
        }
      } catch (err) {
        console.error(
          "Error loading all game data:",
          err
        );
      }
    };

    initData();

    return () => {
      mounted = false;

      if (readyTimerRef.current) {
        clearTimeout(
          readyTimerRef.current
        );
      }
    };
  }, []);

  return {
    allPlayers,
    isReady,
    formatChampName,
  };
};