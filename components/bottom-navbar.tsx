"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Home,
  Bot,
  MessageSquarePlus,
} from "lucide-react";

export function BottomNavbar() {
  const pathname = usePathname();

  const items = [
    {
      href: "/",
      label: "الرئيسية",
      icon: Home,
    },
    {
      href: "/assistant",
      label: "المساعد",
      icon: Bot,
    },
    {
      href: "/help",
      label: "إرسال",
      icon: MessageSquarePlus,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around">

        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 text-xs ${
                active
                  ? "text-primary font-bold"
                  : "text-muted-foreground"
              }`}
            >
              <Icon size={22} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}