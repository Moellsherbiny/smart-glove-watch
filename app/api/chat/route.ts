import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { message, history = [] } = await req.json();

    const recentHistory = history
      .slice(-5)
      .map(
        (msg: { role: "user" | "assistant"; content: string }) =>
          `${msg.role === "user" ? "المستخدم" : "المساعد"}: ${msg.content}`,
      )
      .join("\n");

    const prompt = `
أنت المساعد الذكي الرسمي لتطبيق Life Sense.

Life Sense هو مشروع تخرج لمساعدة الصم وضعاف السمع باستخدام قفاز ذكي يحول لغة الإشارة إلى نص وصوت.

أجب بالعربية.
كن مختصراً ومفيداً.

آخر المحادثة:
${recentHistory}
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
