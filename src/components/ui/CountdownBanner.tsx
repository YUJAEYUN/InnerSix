"use client";

import { useEffect, useState } from "react";

const EVENT_DATE = new Date("2026-02-28T00:00:00+09:00");

function getDiff() {
  const now = new Date();
  const diff = EVENT_DATE.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function CountdownBanner() {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    setDays(getDiff());
    const timer = setInterval(() => setDays(getDiff()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (days === null) return null;

  return (
    <div className="text-center py-1.5 px-4 text-xs text-white/50 tracking-widest">
      {days > 0 ? (
        <>✦ 2026.02.28 행성 퍼레이드까지 D-{days} ✦</>
      ) : days === 0 ? (
        <span className="text-yellow-300/80">✦ 오늘 밤 6개의 행성을 만나세요 ✦</span>
      ) : (
        <>✦ 2026.02.28 행성 퍼레이드 ✦</>
      )}
    </div>
  );
}
