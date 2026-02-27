/**
 * 로컬 자동 소원 생성 테스트 스크립트
 * 실행: node scripts/auto-wish-local.mjs
 * (dev 서버가 실행 중이어야 함)
 */

const BASE_URL = "http://localhost:3000";
const INTERVAL_MS = 10 * 60_000; // 10분

async function triggerAutoWish() {
  try {
    const res = await fetch(`${BASE_URL}/api/auto-wish`);
    const data = await res.json();

    if (data.success) {
      const { nickname, message } = data.wish;
      const time = new Date().toLocaleTimeString("ko-KR");
      console.log(`[${time}] ✦ ${nickname}: ${message.slice(0, 40)}...`);
    } else {
      console.error("오류:", data.error);
    }
  } catch (e) {
    console.error("요청 실패:", e.message);
  }
}

console.log("🌌 자동 소원 생성 시작 (10분 간격)");
console.log("   중단하려면 Ctrl+C\n");

// 시작하자마자 한 번 실행
triggerAutoWish();

// 이후 1분마다 반복
setInterval(triggerAutoWish, INTERVAL_MS);
