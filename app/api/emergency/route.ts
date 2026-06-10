import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, location, timestamp } =
      await req.json();

    const telegramMessage = `
🚨 طلب مساعدة جديد

📝 الرسالة:
${message}

${
  location &&
  location !== "الموقع غير متاح"
    ? `📍 الموقع:\n${location}`
    : "📍 الموقع غير متاح"
}

⏰ الوقت:
${timestamp}
`;

    const telegramResponse =
      await fetch(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            chat_id:
              process.env
                .TELEGRAM_CHAT_ID,
            text: telegramMessage,
          }),
        }
      );

    const telegramData =
      await telegramResponse.json();

    if (
      !telegramResponse.ok ||
      !telegramData.ok
    ) {
      console.error(
        "Telegram Error:",
        telegramData
      );

      return NextResponse.json(
        {
          error:
            "Failed to send telegram message",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Emergency API Error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to send emergency request",
      },
      {
        status: 500,
      }
    );
  }
}