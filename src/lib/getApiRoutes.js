// lib/getApiRoutes.js
import fs from 'fs';
import path from 'path';

export function getApiRoutes(dir = 'app/api', baseRoute = '/api') {
  const routes = [];
  const items = fs.readdirSync(path.join(process.cwd(), dir));

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const relativePath = path.join(baseRoute, item);
    const isDirectory = fs.statSync(fullPath).isDirectory();

    if (isDirectory) {
      // Nếu là folder, kiểm tra xem có file route.ts/js bên trong không
      if (fs.existsSync(path.join(fullPath, 'route.ts')) || fs.existsSync(path.join(fullPath, 'route.js'))) {
        routes.push({
          path: relativePath.replace(/\\/g, '/'),
          name: item,
          type: 'endpoint'
        });
      }
      // Tiếp tục quét sâu hơn (đệ quy)
      routes.push(...getApiRoutes(fullPath, relativePath));
    }
  });

  return routes;
}