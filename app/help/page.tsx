"use client";

import { useState } from "react";
import { Siren, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
export default function EmergencyPage() {
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

const getLocation = async (): Promise<string | null> => {
  try {
    if (
      typeof navigator === "undefined" ||
      !navigator.geolocation
    ) {
      return null;
    }

    return await new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const url = `https://maps.google.com/?q=${position.coords.latitude},${position.coords.longitude}`;

          setLocation(url);

          resolve(url);
        },
        () => {
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
        }
      );
    });
  } catch {
    return null;
  }
};

  const sendEmergency = async () => {
    try {
      setLoading(true);
      setStatus("");

      const currentLocation = await getLocation();

      const response = await fetch("/api/emergency", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "🚨 أحتاج إلى المساعدة فوراً",

          location: currentLocation,

          timestamp: new Date().toLocaleString("ar-EG"),
        }),
      });

      if (!response.ok) {
        throw new Error();
      }

      setStatus("success");
      toast.success("تم إرسال طلب المساعدة بنجاح");
    } catch {
      setStatus("error");
      toast.error("تعذر إرسال الطلب");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="min-h-screen bg-background pb-24">
      <div className="mx-auto max-w-md p-4 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <Siren className="size-8 text-red-500" />
            الطوارئ
          </h1>
        </div>

        {/* SOS */}
        <Card>
          <CardContent className="p-6">
            <Button
              variant="destructive"
              className="h-16 w-full text-lg font-bold"
              disabled={loading}
              onClick={sendEmergency}
            >
              {loading ? "جاري إرسال الطلب..." : "🚨 طلب المساعدة الآن"}
            </Button>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="font-semibold">الموقع الحالي</h2>

            <Button variant="outline" className="w-full" onClick={getLocation}>
              <MapPin className="ml-2 size-4" />
              تحديث الموقع
            </Button>

            {location && (
              <div className="rounded-xl bg-muted p-3 text-sm break-all">
                {location}
              </div>
            )}
          </CardContent>
        </Card>

        {status === "success" && (
          <Card className="border-green-500">
            <CardContent className="p-4 text-green-600">
              ✅ تم إرسال طلب المساعدة بنجاح
            </CardContent>
          </Card>
        )}

        {status === "error" && (
          <Card className="border-red-500">
            <CardContent className="p-4 text-red-600">
              ❌ تعذر إرسال الطلب
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
