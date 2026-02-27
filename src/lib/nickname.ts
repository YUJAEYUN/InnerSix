const adjectives = [
  "꿈꾸는", "반짝이는", "조용한", "빛나는", "신비로운",
  "은은한", "고요한", "영원한", "아득한", "그리운",
  "따뜻한", "차가운", "낯선", "설레는", "깊은",
];

const nouns = [
  "혜성인", "별빛 여행자", "우주 방랑자", "달빛 소원자",
  "은하 탐험가", "행성 관찰자", "성운 거주자", "유성우 수집가",
  "별자리 화가", "우주 항해사", "빛의 수호자", "어둠 속 나그네",
];

export function generateNickname(): string {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj} ${noun}`;
}
