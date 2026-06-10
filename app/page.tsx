"use client";

import { useEffect, useRef, useState } from "react";
import { Hand, Volume2, Wifi, Play, Trash2 } from "lucide-react";
import { ref, onValue } from "firebase/database";

import { db } from "@/lib/firebase";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    AppInventor?: {
      setWebViewString: (value: string) => void;
    };
  }
}

const HISTORY_LIMIT = 5;
export default function HomePage() {

  const [gesture, setGesture] = useState("في انتظار الإشارة...");

  const [history, setHistory] = useState<string[]>([]);

  const [connected, setConnected] = useState(false);

  const [lastUpdate, setLastUpdate] = useState("");

  const [isSpeaking, setIsSpeaking] = useState(false);

  const lastWordRef = useRef("");

  const storage = {
  get(key: string) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  set(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch {}
  },

  remove(key: string) {
    try {
      localStorage.removeItem(key);
    } catch {}
  },
};


  const sendToAppInventor = (message: string) => {
    if (typeof window !== "undefined" && window.AppInventor) {
      window.AppInventor.setWebViewString(message);
    }
  };

  const speak = (text: string) => {
    if (!text || text === "في انتظار الإشارة...") {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);

    utterance.onend = () => setIsSpeaking(false);

    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const savedHistory = storage.get("lifesense-history");

    const savedGesture = storage.get("last-gesture");

    const savedUpdate = storage.get("last-update");

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    if (savedGesture) {
      setGesture(savedGesture);
    }

    if (savedUpdate) {
      setLastUpdate(savedUpdate);
    }
  }, []);

  useEffect(() => {
    storage.set("lifesense-history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    const connectionRef = ref(db, ".info/connected");

    const unsubscribeConnection = onValue(connectionRef, (snapshot) => {
      setConnected(!!snapshot.val());
    });

    const signRef = ref(db, "Glove/Sign");

    const unsubscribeSign = onValue(signRef, (snapshot) => {
      const value = snapshot.val();

      if (
        !value ||
        typeof value !== "string" ||
        value.trim() === "" ||
        value === lastWordRef.current
      ) {
        return;
      }

      lastWordRef.current = value;

      setGesture(value);

      storage.set("last-gesture", value);

      sendToAppInventor(value);

      setHistory((prev) => {
        const updated = [value, ...prev.filter((item) => item !== value)];

        return updated.slice(0, HISTORY_LIMIT);
      });

      const updateTime = new Date().toLocaleTimeString("ar-EG");

      setLastUpdate(updateTime);

      storage.set("last-update", updateTime);

      if (navigator.vibrate) {
        navigator.vibrate(150);
      }

      speak(value);
    });

    return () => {
      unsubscribeConnection();
      unsubscribeSign();
    };
  }, []);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const clearHistory = () => {
    setHistory([]);

    setGesture("في انتظار الإشارة...");

    setLastUpdate("");

    storage.remove("lifesense-history");

    storage.remove("last-gesture");

    storage.remove("last-update");
  };

  return (
    <main className="h-screen bg-linear-to-b from-blue-50 to-slate-100 overflow-hidden">
      <div className="h-full w-full bg-white p-5 overflow-y-auto no-scrollbar pb-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-[20px] bg-linear-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg">
            <Hand className="w-7 h-7" />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold">Life Sense</h1>

            <p className="text-sm text-muted-foreground">
              ترجمة لغة الإشارة إلى صوت ونص
            </p>
          </div>
        </div>

        {/* Connection Status */}
        <Card className="mb-5">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  connected ? "bg-green-500" : "bg-amber-500 animate-pulse"
                }`}
              />

              <span className="font-bold text-sm">
                {connected ? "متصل بقاعدة البيانات" : "غير متصل"}
              </span>
            </div>

            <Wifi className="w-5 h-5" />
          </CardContent>
        </Card>

        {/* Main Card */}
        <Card className="rounded-[32px]">
          <CardContent className="p-6">
            {/* Voice Circle */}
            <div className="flex justify-center mb-5">
              <div
                className={`w-24 h-24 rounded-[30px] bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-xl transition-all duration-300 ${
                  isSpeaking ? "scale-105 shadow-2xl" : ""
                }`}
              >
                <Volume2 className="w-10 h-10" />
              </div>
            </div>

            {/* Label */}
            <p className="text-center text-sm text-muted-foreground font-bold mb-4">
              النص المكتشف
            </p>

            {/* Current Gesture */}
            <div className="min-h-30 flex items-center justify-center">
             <h2 className="text-5xl font-black text-center wrap-break-word leading-relaxed">
                {gesture}
              </h2>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <Button
                size="lg"
                onClick={() => {
                  speak(gesture);

                  sendToAppInventor("REPLAY");
                }}
              >
                <Play className="w-4 h-4 ml-2" />
                إعادة النطق
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={clearHistory}
              >
                <Trash2 className="w-4 h-4 ml-2" />
                مسح السجل
              </Button>
            </div>

            {/* History */}
            <div className="mt-6">
              <h3 className="font-extrabold text-sm mb-3">آخر الكلمات</h3>

              <div className="flex flex-wrap gap-2">
                {history.map((item, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 rounded-xl bg-blue-50 text-blue-600 text-sm font-bold"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground mt-4">
          {lastUpdate
            ? `آخر تحديث: ${lastUpdate}`
            : "لم يتم استقبال أي بيانات بعد"}
        </div>
      </div>
    </main>
  );
}
