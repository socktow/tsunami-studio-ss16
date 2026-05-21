import { NextResponse } from "next/server";

// Mẹo ép toàn bộ tiến trình này bỏ qua kiểm tra chứng chỉ SSL tự ký
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function GET() {
  try {
    const response = await fetch("https://127.0.0.1:2999/liveclientdata/eventdata", {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
      cache: "no-store", // Ép không lưu cache dữ liệu realtime
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: `Riot API status: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Lọc các sự kiện mạng hạ gục
    const killEvents = (data.Events || []).filter((event) => 
      ["ChampionKill", "FirstBlood", "Multikill", "Ace"].includes(event.EventName)
    );

    return NextResponse.json({
      success: true,
      totalKillsInFeed: killEvents.length,
      killFeed: killEvents,
    });

  } catch (error) {
    console.error("Error fetching live client data via Fetch:", error.message);
    return NextResponse.json(
      { success: false, message: "Lỗi kết nối", error: error.message },
      { status: 500 }
    );
  }
}