export const ICONS = {
  GOLD: "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-collections/global/default/icon_gold.png",
  TOWER: "https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/tower.png",
  GRUBS: "https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/grub.png",
  BLUE_PLATES: "https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/tower_blue_bounty.png",
  RED_PLATES: "https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/tower_red_bounty.png",
  DRAGONS: {
    air: "https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/dragon_cloud.png",
    earth: "https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/dragon_mountain.png",
    fire: "https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/dragon_infernal.png",
    water: "https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/dragon_ocean.png",
    hextech: "https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/dragon_hextech.png",
    chemtech: "https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/dragon_chemtech.png",
    elder: "https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/dragon_elder.png"
  },
  LOGOS: {
    T1: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/T1_esports_logo.svg/1280px-T1_esports_logo.svg.png",
    BLG: "https://upload.wikimedia.org/wikipedia/vi/6/66/Bilibili_Gaming_logo_%282021%29.png",
    VCS: "https://roadtovcs.vnggames.com/api/images/team_2_logo_1744360408217/png"
  }
};

export const OBJECTIVE_ICONS = {
  BARON: "https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/baron.png",
  GRUB: "https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/grub.png",
  RIFTHERALD : "https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/riftherald.png",
  DRAGONS: {
    air: "https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/dragon_cloud.png",
    earth: "https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/dragon_mountain.png",
    fire: "https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/dragon_infernal.png",
    water: "https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/dragon_ocean.png",
    hextech: "https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/dragon_hextech.png",
    chemtech: "https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/dragon_chemtech.png",
    elder: "https://raw.communitydragon.org/latest/game/assets/ux/minimap/icons/dragon_elder.png"
  },
};

export const OBJECTIVE_STYLES = {
  baron: {
    gradient: "from-purple-600/40 to-purple-900/10",
    glow: "shadow-[0_0_15px_rgba(168,85,247,0.3)]"
  },
  dragon: {
    gradient: "from-red-600/40 to-red-900/10",
    glow: "shadow-[0_0_15px_rgba(239,68,68,0.3)]"
  }
};

export const ITEM_SLOTS = {
  MAIN: [0, 1, 2, 3, 4, 5],
  TRINKET: 6,
  QUEST: 8
};

export const IMAGE_BASE_URL = "http://localhost:58869/";

export const perkcategory = {
  Domination: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7200_Domination.png",
  Precision: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7201_Precision.png",
  Sorcery: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7202_Sorcery.png",
  Whimsy: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7203_Whimsy.png",
  Resolve: "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7204_Resolve.png",
};

// Định nghĩa các nhóm ID
const groups = {
  [perkcategory.Domination]: [8126,8139,8143,8137,8140,8141,8135,8105,8106],
  [perkcategory.Precision]: [9101,9111,8009,9103,9104,9105,8014,8017,8299], 
  [perkcategory.Sorcery]: [8224,8226,8275,8210,8233,8234,8237,8236,8232],
  [perkcategory.Whimsy]: [8306,8304,8321,8313,8352,8345,8347,8410,8316],
  [perkcategory.Resolve]: [8446,8463,8401,8429,8444,8473,8451,8453,8242]
};

// Tự động gộp vào một Object duy nhất
export const perkIdToCategoryImage = Object.entries(groups).reduce((acc, [url, ids]) => {
  ids.forEach(id => { acc[id] = url; });
  return acc;
}, {});