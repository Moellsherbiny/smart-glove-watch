"use client";

import { useState } from "react";

import {
  Siren,
  Phone,
  Ambulance,
  Shield,
  Flame,
  MapPin,
  Copy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function EmergencyPage() {
  const [location, setLocation] = useState("");

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(
          `${position.coords.latitude}, ${position.coords.longitude}`
        );
      }
    );
  };

  const copyMessage = async (message: string) => {
    await navigator.clipboard.writeText(message);
  };

  const sendEmergency = async () => {
  if (!navigator.geolocation) {
    alert("الموقع غير مدعوم");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const location = `https://maps.google.com/?q=${position.coords.latitude},${position.coords.longitude}`;

      await fetch("/api/emergency", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "أحتاج إلى المساعدة فوراً",
          location,
        }),
      });

      alert("تم إرسال طلب المساعدة");
    },
    () => {
      alert("تعذر الحصول على الموقع");
    }
  );
};
  return (
    <main className="min-h-screen bg-background pb-24">

      <div className="mx-auto max-w-md p-4 space-y-4">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Siren className="text-red-500" />
            الطوارئ
          </h1>

          <p className="text-muted-foreground">
            الوصول السريع للمساعدة والخدمات
          </p>
        </div>

        {/* SOS */}
        <Card>
          <CardContent className="p-5">
            <Button
              variant="destructive"
              className="w-full h-16 text-lg"
              onClick={sendEmergency}
            >
              🚨 طلب مساعدة فوري
            </Button>
          </CardContent>
        </Card>

        {/* Contacts */}
        <Card>
          <CardContent className="p-5 space-y-3">
            <h2 className="font-bold">
              جهات الاتصال السريعة
            </h2>

            <Button
              variant="outline"
              className="w-full justify-start"
            >
              <Phone className="ml-2" />
              الأب
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
            >
              <Phone className="ml-2" />
              الأم
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
            >
              <Phone className="ml-2" />
              المشرف
            </Button>
          </CardContent>
        </Card>

        {/* Emergency Services */}
        <Card>
          <CardContent className="p-5 space-y-3">
            <h2 className="font-bold">
              خدمات الطوارئ
            </h2>

            <Button
              variant="secondary"
              className="w-full justify-start"
            >
              <Ambulance className="ml-2" />
              الإسعاف
            </Button>

            <Button
              variant="secondary"
              className="w-full justify-start"
            >
              <Shield className="ml-2" />
              الشرطة
            </Button>

            <Button
              variant="secondary"
              className="w-full justify-start"
            >
              <Flame className="ml-2" />
              المطافي
            </Button>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardContent className="p-5 space-y-3">
            <h2 className="font-bold">
              الموقع الحالي
            </h2>

            <Button
              className="w-full"
              onClick={getLocation}
            >
              <MapPin className="ml-2" />
              تحديد الموقع
            </Button>

            {location && (
              <div className="rounded-lg bg-muted p-3 text-sm break-all">
                {location}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Messages */}
        <Card>
          <CardContent className="p-5 space-y-3">
            <h2 className="font-bold">
              رسائل جاهزة
            </h2>

            {[
              "أحتاج إلى المساعدة فوراً",
              "أنا في خطر",
              "من فضلك تواصل معي",
              "أحتاج إلى الإسعاف",
            ].map((message) => (
              <Button
                key={message}
                variant="outline"
                className="w-full justify-between"
                onClick={() =>
                  copyMessage(message)
                }
              >
                {message}
                <Copy size={16} />
              </Button>
            ))}
          </CardContent>
        </Card>

      </div>
    </main>
  );
}