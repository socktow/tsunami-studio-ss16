import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function getApiRoutes(dir, baseRoute = '/api') {
  const routes = [];
  const fullDirPath = path.join(process.cwd(), dir);

  // Debug: Kiểm tra xem script có tìm thấy folder không
  console.log(`Scanning: ${fullDirPath}`);

  if (!fs.existsSync(fullDirPath)) {
    console.warn(`Directory not found: ${fullDirPath}`);
    return [];
  }

  const items = fs.readdirSync(fullDirPath);

  items.forEach((item) => {
    if (item === 'scan-routes' || item.startsWith('_') || item.startsWith('.')) return;

    const fullPath = path.join(fullDirPath, item);
    const relativePath = path.join(baseRoute, item);
    const isDirectory = fs.statSync(fullPath).isDirectory();

    if (isDirectory) {
      // Kiểm tra file route.js, route.ts, route.jsx, route.tsx
      const files = fs.readdirSync(fullPath);
      const hasRouteFile = files.some(file => /^route\.(js|ts|jsx|tsx)$/.test(file));

      if (hasRouteFile) {
        routes.push({
          id: relativePath.replace(/\\/g, '/'),
          method: "GET",
          path: relativePath.replace(/\\/g, '/'),
          // Lấy tên folder cha cuối cùng làm group
          folder: item, 
          desc: `Endpoint found in /${item}`
        });
      }
      // Tiếp tục quét sâu hơn
      routes.push(...getApiRoutes(path.join(dir, item), relativePath));
    }
  });

  return routes;
}

export async function GET() {
  // TỰ ĐỘNG CHECK: Thử quét trong 'app/api' hoặc 'src/app/api'
  let targetDir = 'app/api';
  if (!fs.existsSync(path.join(process.cwd(), targetDir))) {
    targetDir = 'src/app/api';
  }

  const allRoutes = getApiRoutes(targetDir);

  // Grouping logic cải tiến
  const grouped = allRoutes.reduce((acc, curr) => {
    const folderName = curr.folder || 'root';
    let group = acc.find(g => g.folder === folderName);
    if (!group) {
      group = { folder: folderName, endpoints: [] };
      acc.push(group);
    }
    group.endpoints.push(curr);
    return acc;
  }, []);

  return NextResponse.json(grouped);
}