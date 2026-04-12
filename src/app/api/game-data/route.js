import { NextResponse } from 'next/server';
import https from 'https';
import axios from 'axios';

export async function GET() {
  try {
    const agent = new https.Agent({ rejectUnauthorized: false });
    const response = await axios.get('https://127.0.0.1:2999/liveclientdata/allgamedata', {
      httpsAgent: agent,
      timeout: 2000 // Tránh treo request nếu game chưa mở
    });

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: 'Game not found' }, { status: 404 });
  }
}