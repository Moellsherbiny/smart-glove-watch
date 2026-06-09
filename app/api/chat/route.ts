import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
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
      }
    );
  }
}