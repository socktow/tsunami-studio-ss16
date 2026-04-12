import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/page"; 
import ContentContainer from "@/components/ContentContainer"; // Tạo thêm file này hoặc viết trực tiếp

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "VCS Overlay Control | Tsunami Studio",
  description: "Hệ thống quản lý giải đấu chuyên nghiệp",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body 
        className="min-h-full flex flex-col bg-white dark:bg-black text-zinc-900 dark:text-zinc-50"
        suppressHydrationWarning={true}
      >
        <Navbar />
        {/* Lớp bọc này sẽ kiểm tra pathname để thêm padding-top hoặc không */}
        <ContentContainer>
          {children}
        </ContentContainer>
      </body>
    </html>
  );
}