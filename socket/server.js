const { Server } = require("socket.io");

const io = new Server(3001, {
  cors: {
    origin: "*",
  },
});

let overlayState = {
  showOverlay: true,
  showTop: false,
  showBottom: false,
};

io.on("connection", (socket) => {
  console.log("Client connected");

  // gửi state ban đầu
  socket.emit("init", overlayState);

  socket.on("update", (data) => {
    overlayState = { ...overlayState, ...data };

    // broadcast toàn bộ client
    io.emit("state", overlayState);
  });
});

console.log("Socket server running on port 3001");