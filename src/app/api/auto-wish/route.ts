import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { generateNickname } from "@/lib/nickname";

export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `당신은 2026년 2월 28일, 수성·금성·토성·목성·천왕성·해왕성 6개 행성이 동시에 밤하늘에 뜨는 '행성 퍼레이드'를 기념하는 웹사이트를 방문한 익명의 사람입니다.

오늘 밤 우주에 소원 한 가지를 남겨주세요. 아래 조건을 지켜주세요:
- 80자 ~ 160자 사이
- 진짜 사람이 혼자 마음속으로 쓰는 것 같은 진솔한 톤
- 행성/우주 언급은 자연스럽게 있어도 되고 없어도 됨
- 주제는 매번 다양하게: 취업, 사랑, 가족, 건강, 꿈, 여행, 외로움, 용기, 일상, 감사 등
- 메시지 텍스트만 출력 (따옴표나 부가 설명 없이)`;

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase 환경변수 없음");
  return createClient(url, key);
}

// Vercel Cron은 GET 요청으로 호출
export async function GET(req: NextRequest) {
  // 프로덕션: CRON_SECRET 검증
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // OpenAI로 소원 생성
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user",   content: "소원을 하나 작성해주세요." },
    ],
    max_tokens: 200,
    temperature: 1.1, // 다양성 높임
  });

  const message = completion.choices[0]?.message?.content?.trim();
  if (!message) {
    return NextResponse.json({ error: "메시지 생성 실패" }, { status: 500 });
  }

  // Supabase에 저장
  const nickname = generateNickname();
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("wishes")
    .insert({ nickname, message })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, wish: data });
}
