import { Hand } from "lucide-react";

export default function Loading() {
  return (
    <main className="h-screen bg-linear-to-br from-blue-600 via-blue-500 to-cyan-500 flex items-center justify-center">
      <div className="flex flex-col items-center text-white">

        <div className="w-28 h-28 rounded-[32px] bg-white/15 backdrop-blur flex items-center justify-center shadow-2xl">
          <Hand size={52} />
        </div>

        <h1 className="mt-6 text-4xl font-extrabold">
          Life Sense
        </h1>

        <p className="mt-2 text-white/90">
          ترجمة لغة الإشارة إلى صوت ونص
        </p>

        <div className="mt-10 flex gap-2">
          <span className="size-3 rounded-full bg-white animate-bounce" />
          <span
            className="size-3 rounded-full bg-white animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="size-3 rounded-full bg-white animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>

      </div>
    </main>
  );
}