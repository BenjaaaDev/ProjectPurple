import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
  }

  const body = {
    session: {
      type: "realtime",
      model: "gpt-realtime",
      audio: {
        output: { voice: "marin" },
      },
      instructions: "Eres un asistente útil. Responde en español, claro y directo.",
    },
  };

  const r = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!r.ok) {
    const errText = await r.text();
    return NextResponse.json({ error: errText }, { status: 500 });
  }

  const data = await r.json();
  return NextResponse.json({ value: data.value });
}
