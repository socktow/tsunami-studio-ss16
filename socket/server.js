const { Server } = require("socket.io");
const LCU = require("league-connect");
const https = require("https");
const axios = require("axios");

const io = new Server(3001, { cors: { origin: "*" } });

let lcuStatus = {
  connected: false,
  port: null,
  pid: null,
  password: null,
  certificate: null,
  currentGame: null 
};

// Hàm gọi API LCU để lấy trạng thái trận đấu
async function updateGameflowStatus(credentials) {
  try {
    // Tạo agent bỏ qua check certificate tự ký của Riot
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });
    
    const response = await axios.get(
      `https://127.0.0.1:${credentials.port}/lol-gameflow/v1/session`,
      {
        auth: { username: "riot", password: credentials.password },
        httpsAgent,
      }
    );

    const session = response.data;

    // Nếu game đang chạy hoặc đang trong trận (InProgress)
    if (session && session.gameData) {
      lcuStatus.currentGame = {
        gameId: session.gameData.gameId,
        gameMode: session.queue?.gameMode || "UNKNOWN",
        mapDescription: session.queue?.description || "Không rõ chế độ",
        phase: session.phase,
        playerCount: session.gameData.playerChampionSelections?.length || 0
      };
    } else {
      lcuStatus.currentGame = null;
    }
  } catch (error) {
    lcuStatus.currentGame = null;
  }
}

async function startLCUWatcher() {
  console.log("🚀 Đang khởi động trình theo dõi LCU...");

  setInterval(async () => {
    try {
      const credentials = await LCU.authenticate();

      if (credentials) {
        const isFirstConnect = !lcuStatus.connected;
        
        lcuStatus.connected = true;
        lcuStatus.port = credentials.port;
        lcuStatus.pid = credentials.pid;
        lcuStatus.password = credentials.password;
        lcuStatus.certificate = credentials.certificate;

        // Quét thông tin trận đấu liên tục
        await updateGameflowStatus(credentials);

        // Phát tín hiệu update sang React mỗi 3 giây
        io.emit("lcu-status", lcuStatus);

        if (isFirstConnect) console.log(`✅ Đã kết nối LCU! Port: ${credentials.port}`);
      }
    } catch (error) {
      if (lcuStatus.connected) {
        console.log("❌ LCU đã ngắt kết nối");
        lcuStatus = { connected: false, port: null, pid: null, password: null, certificate: null, currentGame: null };
        io.emit("lcu-status", lcuStatus);
      }
    }
  }, 3000);
}

startLCUWatcher();

// Logic Socket cho Dashboard giữ nguyên...
let overlayState = { showOverlay: true, showTop: false, showBottom: false };
io.on("connection", (socket) => {
  socket.emit("init", overlayState);
  socket.emit("lcu-status", lcuStatus);
  socket.on("update", (data) => {
    overlayState = { ...overlayState, ...data };
    io.emit("state", overlayState);
  });
});