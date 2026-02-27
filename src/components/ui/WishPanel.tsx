"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Wish } from "@/lib/supabase";

type Props = {
  open: boolean;
  onClose: () => void;
  wishes: Wish[];
  loading: boolean;
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "방금 전";
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}

export default function WishPanel({ open, onClose, wishes, loading }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 모바일 오버레이 */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40 sm:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* 패널 — 모바일: 하단 시트 / 데스크탑: 우측 사이드 */}
          <motion.div
            className="
              fixed z-50 bg-[#0a0a1e]/95 backdrop-blur-md border-white/10
              bottom-0 left-0 right-0 rounded-t-2xl border-t
              sm:top-0 sm:right-0 sm:bottom-0 sm:left-auto sm:w-80 sm:rounded-none sm:border-t-0 sm:border-l
            "
            initial={{ y: "100%", x: 0 }}
            animate={{ y: 0, x: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            // 데스크탑에선 x 방향으로 슬라이드
            style={{ maxHeight: "80dvh" }}
          >
            {/* 핸들 바 (모바일) */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div>
                <h2 className="text-white font-semibold">다른 사람의 소원</h2>
                <p className="text-white/40 text-xs mt-0.5">{wishes.length}개의 소원이 우주를 떠돌고 있어요</p>
              </div>
              <button
                onClick={onClose}
                className="text-white/40 hover:text-white/80 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: "calc(80dvh - 80px)" }}>
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-6 h-6 border-2 border-purple-500/40 border-t-purple-500 rounded-full animate-spin" />
                </div>
              ) : wishes.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-white/30 text-sm">아직 소원이 없어요</p>
                  <p className="text-white/20 text-xs mt-1">첫 번째 소원을 남겨보세요</p>
                </div>
              ) : (
                <ul className="divide-y divide-white/5">
                  {wishes.map((wish) => (
                    <li key={wish.id} className="px-5 py-4">
                      <p className="text-white/40 text-xs mb-1.5 flex items-center gap-2">
                        <span className="text-purple-400">✦</span>
                        {wish.nickname}
                        <span className="ml-auto">{timeAgo(wish.created_at)}</span>
                      </p>
                      <p className="text-white/85 text-sm leading-relaxed">{wish.message}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
