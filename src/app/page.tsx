"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import WishModal from "@/components/ui/WishModal";
import WishPanel from "@/components/ui/WishPanel";
import CountdownBanner from "@/components/ui/CountdownBanner";
import type { Wish } from "@/lib/supabase";

// SSR 제외 — Three.js는 브라우저에서만 동작
const PlanetScene = dynamic(() => import("@/components/scene/PlanetScene"), {
  ssr: false,
  loading: () => <SceneLoader />,
});

function SceneLoader() {
  return (
    <div className="fixed inset-0 bg-[#050510] flex flex-col items-center justify-center gap-4">
      <div className="w-8 h-8 border-2 border-purple-500/40 border-t-purple-400 rounded-full animate-spin" />
      <p className="text-white/30 text-sm tracking-widest">밤하늘을 불러오는 중...</p>
    </div>
  );
}

export default function Home() {
  const [wishModalOpen, setWishModalOpen] = useState(false);
  const [wishPanelOpen, setWishPanelOpen] = useState(false);
  const [showOrbs, setShowOrbs] = useState(false);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [wishesLoading, setWishesLoading] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const fetchWishes = useCallback(async () => {
    setWishesLoading(true);
    try {
      const res = await fetch("/api/wishes");
      if (res.ok) {
        const data: Wish[] = await res.json();
        setWishes(data);
      }
    } finally {
      setWishesLoading(false);
    }
  }, []);

  const handleOpenPanel = async () => {
    setWishPanelOpen(true);
    setShowOrbs(true);
    if (wishes.length === 0) {
      await fetchWishes();
    }
  };

  const handleWishSuccess = (wish: Wish) => {
    setWishes((prev) => [wish, ...prev]);
    setSuccessBanner(`✦ ${wish.nickname}의 소원이 우주로 날아갔어요`);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <main className="fixed inset-0 bg-[#050510]">
      {/* 3D 씬 — 전체 화면 */}
      <div className="absolute inset-0">
        <PlanetScene wishes={wishes} showOrbs={showOrbs} />
      </div>

      {/* 상단 헤더 */}
      <header className="absolute top-0 left-0 right-0 z-10">
        <CountdownBanner />
        <div className="flex items-center justify-between px-5 py-3">
          <h1 className="text-white font-semibold tracking-wider text-sm sm:text-base">
            INNER<span className="text-purple-400">SIX</span>
          </h1>
          <p className="text-white/30 text-xs hidden sm:block">
            2026.02.28 행성 퍼레이드
          </p>
        </div>
      </header>

      {/* 중앙 타이틀 */}
      <AnimatePresence>
        {!wishPanelOpen && !wishModalOpen && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <p className="text-white/20 text-xs tracking-[0.3em] mb-3 uppercase">
              Planet Parade
            </p>
            <h2 className="text-white/70 text-2xl sm:text-4xl font-light text-center leading-snug">
              6개의 행성이<br />
              <span className="text-white font-semibold">오늘 밤 하늘에 뜹니다</span>
            </h2>
            <p className="text-white/30 text-sm mt-4 text-center px-8">
              드래그하여 우주를 탐험하고<br className="sm:hidden" /> 소원을 남겨보세요
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 성공 토스트 */}
      <AnimatePresence>
        {successBanner && (
          <motion.div
            className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-purple-900/80 backdrop-blur-sm border border-purple-500/30 rounded-full px-5 py-2 text-white/90 text-sm whitespace-nowrap"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
          >
            {successBanner}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 지평선 그라디언트 — 땅 위에 서 있는 느낌 */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[5] pointer-events-none"
        style={{
          height: "28%",
          background: "linear-gradient(to top, #020308 0%, #050510aa 40%, transparent 100%)",
        }}
      />

      {/* 하단 버튼 */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pb-8 sm:pb-10">
        <p className="text-white/20 text-xs text-center mb-4 sm:hidden">
          손가락으로 드래그 · 핀치로 줌
        </p>
        <div className="flex items-center justify-center gap-3 px-6">
          <button
            onClick={() => setWishModalOpen(true)}
            className="flex-1 sm:flex-none sm:w-44 bg-purple-600/90 hover:bg-purple-500 active:scale-95 text-white font-medium py-3.5 px-6 rounded-2xl transition-all text-sm backdrop-blur-sm border border-purple-400/20 shadow-lg shadow-purple-900/30"
          >
            소원 빌기 ✦
          </button>
          <button
            onClick={handleOpenPanel}
            className="flex-1 sm:flex-none sm:w-44 bg-white/8 hover:bg-white/15 active:scale-95 text-white/80 font-medium py-3.5 px-6 rounded-2xl transition-all text-sm backdrop-blur-sm border border-white/10 shadow-lg"
          >
            소원 구경하기
          </button>
        </div>
      </div>

      {/* 모달 / 패널 */}
      <WishModal
        open={wishModalOpen}
        onClose={() => setWishModalOpen(false)}
        onSuccess={handleWishSuccess}
      />
      <WishPanel
        open={wishPanelOpen}
        onClose={() => setWishPanelOpen(false)}
        wishes={wishes}
        loading={wishesLoading}
      />
    </main>
  );
}
