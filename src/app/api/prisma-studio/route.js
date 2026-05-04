import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import net from 'net';

// Hàm kiểm tra xem port 5555 đã mở chưa
const checkPort = (port) => {
  return new Promise((resolve) => {
    const tester = net.createServer()
      .once('error', () => resolve(true)) // Port đang bận (Studio đang chạy)
      .once('listening', () => {
        tester.once('close', () => resolve(false)).close(); // Port rảnh
      })
      .listen(port);
  });
};

export async function POST() {
  const isRunning = await checkPort(5555);

  if (!isRunning) {
    // Nếu chưa chạy, thực hiện lệnh npx prisma studio
    // Lưu ý: Trong môi trường dev, lệnh này sẽ chạy ngầm
    exec('npx prisma studio', (err) => {
      if (err) console.error("Prisma Studio Error:", err);
    });
    // Đợi một chút để studio khởi động
    await new Promise(res => setTimeout(res, 2000));
  }

  return NextResponse.json({ 
    url: 'http://localhost:5555',
    status: isRunning ? 'ALREADY_RUNNING' : 'STARTED' 
  });
}