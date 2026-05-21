import { NextResponse } from 'next/server';
import https from 'https';
import axios from 'axios';

// Bảng chuyển đổi các trường hợp đặc biệt cho hệ thống DDragon
const SPECIAL_CASES = {
  "Wukong": "MonkeyKing",
  "LeBlanc": "Leblanc",
  "Kha'Zix": "Khazix",
  "Cho'Gath": "Chogath",
  "Vel'Koz": "Velkoz",
  "Bel'Veth": "Belveth",
  "Nunu & Willump": "Nunu",
  "Renata Glasc": "Renata",
  "Dr. Mundo": "DrMundo",
};

// Hàm chuẩn hóa tên tướng giống hệt bên Frontend của bạn
const formatChampName = (name) => {
  if (!name) return "";
  const f = name.replace(/[\s'.]/g, "");
  return SPECIAL_CASES[name] || f;
};

// Cache dữ liệu CDN của Riot để tránh fetch đi fetch lại làm chậm API
let riotChampionsCache = null;
let lastFetchedTime = 0;
const CACHE_DURATION = 1000 * 60 * 60; // Cache trong 1 tiếng

async function getRiotSkinData() {
  const now = Date.now();
  if (riotChampionsCache && (now - lastFetchedTime < CACHE_DURATION)) {
    return riotChampionsCache;
  }

  try {
    const res = await axios.get(
      'https://riot-web-cdn.s3.amazonaws.com/game-data/latest/live/gameData_vi_VN.json',
      { timeout: 5000 }
    );
    riotChampionsCache = res.data.champions || res.data;
    lastFetchedTime = now;
    return riotChampionsCache;
  } catch (err) {
    console.error("Không thể fetch dữ liệu CDN từ Riot:", err.message);
    return riotChampionsCache || {};
  }
}

export async function GET() {
  try {
    // 1. Lấy dữ liệu từ Riot CDN trước
    const championsData = await getRiotSkinData();
    const championsList = Object.values(championsData || {});

    // 2. Lấy dữ liệu từ Game Client đang chạy
    const agent = new https.Agent({ rejectUnauthorized: false });
    const response = await axios.get('https://127.0.0.1:2999/liveclientdata/playerlist', {
      httpsAgent: agent,
      timeout: 2000 
    });

    // 3. Tiến hành map dữ liệu và sinh URL ảnh tự động
    const filteredPlayers = response.data.map(player => {
      let baseSkinID = player.skinID; 
      let cleanSkinName = player.skinName;
      let lowestCDN = {}; 

      // Tìm tướng tương ứng trong dữ liệu Riot CDN
      const champEntry = championsList.find(
        c => c.name === player.championName || c.alias === player.championName
      );

      if (champEntry && champEntry.skins && player.skinName) {
        const matchedNameWithoutChroma = player.skinName.split(' (')[0].trim();
        const skinsArray = Object.entries(champEntry.skins);

        const matchedSkins = skinsArray.filter(([id, info]) => {
          return info.name === matchedNameWithoutChroma || info.name.startsWith(matchedNameWithoutChroma + " (");
        });

        if (matchedSkins.length > 0) {
          matchedSkins.sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
          const [lowestId, lowestInfo] = matchedSkins[0];
          
          lowestCDN[lowestId] = {
            name: lowestInfo.name
          };

          const fullSkinID = parseInt(lowestId);
          baseSkinID = fullSkinID % 1000; 
          cleanSkinName = lowestInfo.name;
        }
      }

      // Chuẩn hóa tên tướng để ném vào URL của DDragon (ví dụ: Cho'Gath -> Chogath)
      const formattedChamp = formatChampName(player.championName);
      
      // Tạo URL ảnh Loading hoàn chỉnh dựa trên baseSkinID đã tìm được
      const loadingImgUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${formattedChamp}_${baseSkinID}.jpg`;

      // Trả về cấu trúc JSON mới bổ sung url ảnh
      return {
        // championName: player.championName,
        riotIdGameName: player.riotIdGameName,
        skinName: player.skinName,
        loadingImgUrl: loadingImgUrl,
        // cleanSkinName: cleanSkinName,
        // skinID: player.skinID,
        // baseSkinID: baseSkinID,
        // CDN: lowestCDN 
      };
    });

    return NextResponse.json(filteredPlayers);
  } catch (error) {
    console.error("Lỗi API Route:", error.message);
    return NextResponse.json({ error: 'Game not found' }, { status: 404 });
  }
}