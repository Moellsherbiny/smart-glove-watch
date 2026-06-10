import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const message = typeof body.message === "string" ? body.message : "";

    const history = Array.isArray(body.history) ? body.history : [];

    const recentHistory = (history as ChatMessage[])
      .slice(-5)
      .map(
        (msg) =>
          `${msg.role === "user" ? "المستخدم" : "المساعد"}: ${msg.content}`,
      )
      .join("\n");

    const conversationContext = recentHistory.trim()
      ? `
آخر المحادثة:
${recentHistory}
`
      : "";
const prompt = `
أنت المساعد الذكي الرسمي لتطبيق Life Sense.

Life Sense هو مشروع تخرج لمساعدة الصم وضعاف السمع باستخدام قفاز ذكي يحول لغة الإشارة إلى نص وصوت.

أجب بالعربية.
كن مختصراً ومفيداً.

${conversationContext}

سؤال المستخدم:
${message}
`;
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
    });

    return NextResponse.json({
      text: response.text,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        text: "حدث خطأ أثناء معالجة الرسالة",
      },
      {
        status: 500,
      },
    );
  }
}
