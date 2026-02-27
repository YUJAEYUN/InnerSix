# InnerSix — 6행성 퍼레이드 소원 웹사이트

## 개요

2026년 2월 28일, 수성·금성·토성·목성·천왕성·해왕성 총 6개의 행성이 지구의 밤하늘에 동시에 관측되는 특별한 천문 현상(행성 퍼레이드)이 일어납니다.

육안으로 보기엔 행성이 너무 멀어 실제감이 부족하기 때문에, 이 특별한 순간을 웹사이트에서 3D 인터랙티브 밤하늘로 재현합니다. 사용자는 익명으로 소원을 빌고, 다른 사람들의 소원을 우주 속에서 발견할 수 있습니다.

---

## 기술 스택

| 영역 | 선택 | 이유 |
|------|------|------|
| 프레임워크 | Next.js 14 (App Router) + TypeScript | SEO, 성능, 생태계 |
| 3D 렌더링 | React Three Fiber (R3F) + Three.js | 선언적 3D, React 통합 |
| 3D 유틸 | @react-three/drei | OrbitControls, 스타필드, 텍스처 로더 |
| 애니메이션 | GSAP + Framer Motion | GSAP: 타임라인/카메라, Framer: UI 전환 |
| 스타일링 | Tailwind CSS v4 | 반응형, 유틸리티 우선 |
| 데이터베이스 | Supabase (PostgreSQL) | 익명 소원 저장, 실시간 구독 |
| 배포 | Vercel | Edge 함수, CDN |

---

## 아키텍처

```
app/
├── page.tsx              # 메인 페이지 (3D 씬)
├── api/
│   └── wishes/
│       └── route.ts      # GET (랜덤 소원 목록), POST (소원 저장)
├── components/
│   ├── scene/
│   │   ├── StarField.tsx      # 별 파티클 시스템
│   │   ├── Planet.tsx         # 행성 단일 컴포넌트
│   │   ├── PlanetScene.tsx    # 6개 행성 + 카메라 구성
│   │   ├── AtmosphereGlow.tsx # 대기 글로우 효과
│   │   └── WishOrbs.tsx       # 소원을 우주에 떠다니는 구체로 표현
│   ├── ui/
│   │   ├── WishModal.tsx      # 소원 입력 모달
│   │   ├── WishCard.tsx       # 다른 사람 소원 카드
│   │   ├── PlanetInfo.tsx     # 행성 정보 패널 (hover)
│   │   └── MobileControls.tsx # 모바일 터치 안내 UI
│   └── layout/
│       ├── Header.tsx
│       └── EventBanner.tsx    # "2026.02.28 행성 퍼레이드 D-N" 카운트다운
└── lib/
    ├── supabase.ts
    ├── nickname.ts       # 랜덤 닉네임 생성 로직
    └── planets.ts        # 행성 데이터 (크기, 색상, 위치, 텍스처 URL)
```

---

## 데이터베이스 스키마 (Supabase)

```sql
-- 소원 테이블
create table wishes (
  id          uuid primary key default gen_random_uuid(),
  nickname    text not null,
  message     text not null check (char_length(message) <= 200),
  created_at  timestamptz default now()
);

-- 익명 접근 허용 (RLS)
alter table wishes enable row level security;
create policy "anyone can read wishes"  on wishes for select using (true);
create policy "anyone can write wishes" on wishes for insert with check (true);
```

---

## 행성 데이터

```ts
// lib/planets.ts
export const PLANETS = [
  { id: "mercury", name: "수성", nameEn: "Mercury", size: 0.4,  color: "#b5b5b5", position: [-8,  1,  2] },
  { id: "venus",   name: "금성", nameEn: "Venus",   size: 0.9,  color: "#e8cda0", position: [-4,  0,  0] },
  { id: "saturn",  name: "토성", nameEn: "Saturn",  size: 1.4,  color: "#e4d191", position: [ 2, -1,  1], rings: true },
  { id: "jupiter", name: "목성", nameEn: "Jupiter", size: 2.0,  color: "#c88b3a", position: [ 6,  1, -1] },
  { id: "uranus",  name: "천왕성", nameEn: "Uranus", size: 1.1, color: "#7de8e8", position: [10,  0,  2] },
  { id: "neptune", name: "해왕성", nameEn: "Neptune",size: 1.0, color: "#4b70dd", position: [14, -1, -1] },
];
```

---

## 핵심 기능 상세

### 1. 3D 밤하늘 씬 (PlanetScene)

- **배경**: 구체형 스타필드 (`<Stars>` from drei) — 8000개 이상 별 파티클
- **행성**: 각 행성에 고해상도 텍스처 적용 (NASA/Solar System Scope 무료 텍스처)
  - 토성: 고리(RingGeometry) 별도 렌더링, 반투명 처리
  - 목성: 대기 띠 텍스처
  - 금성: 대기 글로우 (AdditiveBlending)
- **조명**: AmbientLight(약한 우주 조명) + DirectionalLight(태양 방향) + 각 행성별 포인트라이트
- **카메라**: 초기 전체 조망 → 행성 클릭 시 부드러운 카메라 이동 (GSAP)
- **포스트 프로세싱** (`@react-three/postprocessing`):
  - Bloom: 행성 글로우 효과
  - Vignette: 밤하늘 가장자리 어두움
  - ChromaticAberration: 고급스러운 렌즈 왜곡

### 2. 행성 인터랙션

- **Hover**: 행성 이름 + 설명 툴팁, 글로우 강도 증가
- **Click**:
  - 카메라가 해당 행성으로 부드럽게 줌인 (1.5초 애니메이션)
  - 사이드 패널에 행성 정보 + "이 행성에서 소원 빌기" 버튼 표시
  - 배경에서 은하수처럼 소원 오브 떠다님
- **Auto-rotate**: 사용자 인터랙션 없을 때 천천히 씬 회전

### 3. 소원 시스템

**작성 플로우:**
1. "소원 빌기" 버튼 클릭 (메인 CTA 버튼)
2. 소원 입력 모달 오픈 (Framer Motion으로 부드러운 등장)
3. 텍스트 입력 (최대 200자)
4. 제출 → 클라이언트에서 랜덤 닉네임 즉시 생성 + Supabase에 저장
5. 성공 애니메이션: 소원이 별빛처럼 우주로 날아가는 파티클 이펙트

> 로그인 없음, 추적 없음 — 닉네임 + 메시지만 저장

**랜덤 닉네임 생성 규칙:**
```ts
// 예시: "꿈꾸는 혜성인" / "별빛 여행자" / "은하의 방랑자"
const adjectives = ["꿈꾸는", "반짝이는", "조용한", "빛나는", "신비로운", ...];
const nouns = ["혜성인", "별빛 여행자", "우주 방랑자", "달빛 소원자", ...];
```

**열람 플로우:**
- "소원 구경하기" 버튼 클릭
- 씬에 소원들이 작은 발광 구체(Orb)로 떠다님
- Orb 클릭 → 소원 내용 카드 팝업 (닉네임 + 메세지)
- 별도 패널에서 최근 소원 목록 스크롤 열람 (최대 20개 랜덤)

### 4. 카운트다운 배너

```
✦ 2026.02.28 행성 퍼레이드까지 D-1 ✦
```

- 헤더 상단 또는 화면 하단 고정 (subtle하게)
- 당일에는 "✦ 오늘 밤 6개의 행성을 만나세요 ✦" 문구로 변경

---

## 반응형 전략 (Mobile-First)

### 브레이크포인트

| 기기 | 너비 | 대응 |
|------|------|------|
| Mobile | < 640px | 단순화된 씬, 하단 UI |
| Tablet | 640–1024px | 중간 레이아웃 |
| Desktop | > 1024px | 풀 3D 경험 |

### 모바일 특화 처리

**3D 씬 최적화:**
- `pixelRatio` 낮춤 (`Math.min(devicePixelRatio, 1.5)`) → GPU 부하 감소
- 별 파티클 수 절반으로 감소 (8000 → 3000)
- 포스트 프로세싱 Bloom만 유지, 나머지 비활성화
- 행성 폴리곤 수 감소 (LOD 적용)

**터치 인터랙션:**
- `OrbitControls`의 `enableZoom` + `enablePan` 기본 허용
- 핀치 투 줌 지원
- 행성 탭 → 클릭과 동일하게 처리
- 더블탭 → 행성 포커스 모드

**UI 레이아웃 (모바일):**
```
┌──────────────────────────┐
│  InnerSix    D-1 배너     │  ← 헤더 (고정)
├──────────────────────────┤
│                          │
│    [3D 밤하늘 씬]         │  ← 전체 화면 (터치 가능)
│                          │
├──────────────────────────┤
│ [소원 빌기 ✦]  [소원 보기] │  ← 하단 고정 버튼
└──────────────────────────┘
```

**UI 레이아웃 (데스크탑):**
```
┌────────────────────────────────────────┐
│  InnerSix                  D-1 배너    │
├───────────────────────┬────────────────┤
│                       │  행성 정보     │
│   [3D 밤하늘 씬]       │  패널          │
│   (클릭/드래그)        │  (우측 슬라이드)|
│                       │               │
├───────────────────────┴────────────────┤
│         [✦ 소원 빌기]    [소원 보기]    │
└────────────────────────────────────────┘
```

---

## 고퀄리티 UI/UX 디테일

### 색상 팔레트 (다크 테마 전용)

```
배경:      #050510  (딥 네이비 블랙)
보조 배경:  #0a0a1f
강조 색상:  #6c63ff  (보라 — 우주적 느낌)
금색:       #f0c060  (별빛)
텍스트:     #e0e0ff  (약한 파란빛 흰색)
```

### 타이포그래피

- 헤딩: `Playfair Display` (세리프 — 고급스러운 느낌)
- 본문: `Inter` 또는 `Pretendard` (가독성)
- 행성 이름: `Space Grotesk` (SF 느낌)

### 마이크로 인터랙션

- 버튼 hover: 부드러운 글로우 + scale 1.03
- 소원 제출 성공: 화면에 별빛 파티클 burst 효과 (confetti-like)
- 행성 hover: 궤도 링 표시 + 이름 fade-in
- 스크롤/스와이프로 행성 간 이동 (모바일)
- 로딩 스크린: 행성들이 하나씩 등장하는 인트로 애니메이션

### 접근성

- `aria-label` 모든 인터랙티브 요소에 적용
- 키보드 네비게이션: Tab → 행성 포커스, Enter → 클릭
- `prefers-reduced-motion` 미디어 쿼리로 애니메이션 비활성화 옵션
- 색상 대비 WCAG AA 준수

---

## 구현 순서 (페이즈)

### Phase 1 — 기반 세팅 (1일)
- [ ] Next.js 14 + TypeScript 프로젝트 초기화
- [ ] Tailwind CSS v4 설정
- [ ] Supabase 프로젝트 생성 + `wishes` 테이블 마이그레이션
- [ ] 환경 변수 설정 (`.env.local`)
- [ ] Vercel 연결 + 자동 배포 파이프라인

### Phase 2 — 3D 씬 구축 (2–3일)
- [ ] React Three Fiber 기본 캔버스 세팅
- [ ] StarField 컴포넌트 (파티클 배경)
- [ ] 6개 행성 배치 + 텍스처 적용
- [ ] 토성 고리 구현
- [ ] 행성 자전 애니메이션 (useFrame)
- [ ] 조명 시스템 (태양광 + 대기)
- [ ] Bloom 포스트 프로세싱

### Phase 3 — 인터랙션 (1–2일)
- [ ] OrbitControls (드래그/핀치)
- [ ] 행성 Hover 효과 + 툴팁
- [ ] 행성 Click → 카메라 줌인 (GSAP)
- [ ] 모바일 터치 최적화

### Phase 4 — 소원 기능 (1–2일)
- [ ] Supabase API 연동 (GET/POST)
- [ ] 랜덤 닉네임 생성 유틸
- [ ] WishModal 컴포넌트 (입력 폼)
- [ ] 소원 성공 파티클 이펙트
- [ ] WishOrbs — 씬에 소원 구체 표시
- [ ] 소원 열람 패널/모달

### Phase 5 — 반응형 + 폴리싱 (1–2일)
- [ ] 모바일 레이아웃 완성
- [ ] 3D 성능 최적화 (픽셀 비율, LOD)
- [ ] 카운트다운 배너
- [ ] 로딩 스크린 인트로 애니메이션
- [ ] SEO 메타태그 (og:image, twitter card)
- [ ] Lighthouse 점수 최적화

---

## 성능 고려사항

- **Code Splitting**: R3F 씬은 dynamic import로 SSR 제외
  ```ts
  const PlanetScene = dynamic(() => import('@/components/scene/PlanetScene'), { ssr: false });
  ```
- **텍스처 최적화**: WebP 변환 + 압축, 모바일용 저해상도 버전 별도 로드
- **Suspense + fallback**: 3D 로딩 중 스켈레톤 UI 표시
- **Supabase 쿼리**: 소원 목록 최대 20개 랜덤 페치 (`order by random() limit 20`)

---

## 참고 레퍼런스

- 행성 텍스처: [Solar System Scope](https://www.solarsystemscope.com/textures/) (무료 라이센스)
- NASA 행성 정보: NASA Planetary Fact Sheets
- R3F 공식 예제: [r3f.docs.pmnd.rs](https://r3f.docs.pmnd.rs)
- 유사 레퍼런스 사이트: [Stars in the Sky by Stripe](https://stripe.com) 스타일
