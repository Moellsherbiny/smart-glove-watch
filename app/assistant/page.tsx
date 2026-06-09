"use client";

import { useState } from "react";
import { Bot, SendHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

export default function AssistantPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: "مرحباً 👋 كيف يمكنني مساعدتك اليوم؟",
    },
  ]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "user",
        content: userMessage,
      },
    ]);

    setInput("");

    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: data.text,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: "حدث خطأ في الاتصال",
        },
      ]);
    }
    setLoading(false);
  };

  return (
    <main className="flex h-screen flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-md px-4 py-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>
                <Bot className="size-5" />
              </AvatarFallback>
            </Avatar>

            <div>
              <h1 className="font-bold">مساعد Life Sense</h1>

              <p className="text-xs text-green-600">متصل الآن</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="mx-auto max-w-md px-4 py-6 space-y-4 text-right">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-[24px] px-4 py-3 text-[15px]
leading-8
tracking-wide shadow-md ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => (
                      <p className="leading-8 mb-4">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc pr-5 space-y-2">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal pr-5 space-y-2">
                        {children}
                      </ol>
                    ),
                    code: ({ children }) => (
                      <code className="bg-muted px-1.5 py-0.5 rounded">
                        {children}
                      </code>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>

                {loading && (
                  <div className="flex justify-end">
                    <div className="bg-muted rounded-[24px] px-5 py-4">
                      <div className="flex gap-1">
                        <div className="size-2 rounded-full bg-muted-foreground animate-bounce" />
                        <div
                          className="size-2 rounded-full bg-muted-foreground animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <div
                          className="size-2 rounded-full bg-muted-foreground animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Suggestions */}
      <div className="px-4 pb-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setInput("أحتاج مساعدة")}
          >
            أحتاج مساعدة
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setInput("كيف أستخدم التطبيق؟")}
          >
            كيفية الاستخدام
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setInput("التواصل مع العائلة")}
          >
            التواصل مع العائلة
          </Button>
        </div>
      </div>

      {/* Input */}
      <div className="border-t bg-background">
        <div className="mx-auto max-w-md p-4 pb-24">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب رسالتك..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />

            <Button size="icon" onClick={sendMessage}>
              <SendHorizontal className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
