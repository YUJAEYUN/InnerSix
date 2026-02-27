import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InnerSix — 6행성 퍼레이드",
  description:
    "2026년 2월 28일, 6개의 행성이 동시에 밤하늘에 뜨는 특별한 날. 우주에 당신의 소원을 남겨보세요.",
  openGraph: {
    title: "InnerSix — 6행성 퍼레이드",
    description: "2026.02.28 행성 퍼레이드 기념 소원 웹사이트",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
