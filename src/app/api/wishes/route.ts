import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
  return createClient(url, key);
}

export async function GET() {
  const supabase = getClient();

  const { data, error } = await supabase
    .from("wishes")
    .select("id, nickname, message, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const shuffled = (data ?? []).sort(() => Math.random() - 0.5).slice(0, 20);
  return NextResponse.json(shuffled);
}

export async function POST(req: NextRequest) {
  const supabase = getClient();
  const { nickname, message } = await req.json();

  if (!nickname || !message) {
    return NextResponse.json({ error: "닉네임과 메시지가 필요합니다." }, { status: 400 });
  }
  if (message.length > 200) {
    return NextResponse.json({ error: "메시지는 200자 이내여야 합니다." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("wishes")
    .insert({ nickname, message })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
