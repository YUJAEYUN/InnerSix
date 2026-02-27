"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateNickname } from "@/lib/nickname";
import type { Wish } from "@/lib/supabase";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: (wish: Wish) => void;
};

export default function WishModal({ open, onClose, onSuccess }: Props) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const maxLength = 200;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError("");

    const nickname = generateNickname();

    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, message: message.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "오류가 발생했습니다.");
      }

      const wish: Wish = await res.json();
      onSuccess(wish);
      setMessage("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* 모달 */}
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="w-full max-w-md bg-[#0d0d24] border border-white/15 rounded-2xl p-6 shadow-2xl">
              {/* 헤더 */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-white text-lg font-semibold">소원 빌기</h2>
                  <p className="text-white/40 text-sm mt-0.5">
                    익명으로 우주에 소원을 남겨요
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/40 hover:text-white/80 transition-colors text-xl leading-none"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {/* 텍스트 입력 */}
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={maxLength}
                  rows={4}
                  placeholder="오늘 밤 우주에 전하고 싶은 소원을 적어주세요..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/25 text-sm resize-none focus:outline-none focus:border-purple-500/60 transition-colors"
                  autoFocus
                />

                {/* 글자수 + 에러 */}
                <div className="flex items-center justify-between mt-2 mb-4">
                  <p className="text-red-400 text-xs">{error}</p>
                  <p className="text-white/30 text-xs">
                    {message.length} / {maxLength}
                  </p>
                </div>

                {/* 닉네임 안내 */}
                <p className="text-white/30 text-xs mb-4">
                  ✦ 제출하면 랜덤 닉네임이 자동으로 생성됩니다
                </p>

                {/* 버튼 */}
                <button
                  type="submit"
                  disabled={!message.trim() || loading}
                  className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-white/10 disabled:text-white/30 text-white font-medium py-3 rounded-xl transition-colors"
                >
                  {loading ? "전송 중..." : "소원 보내기 ✦"}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
