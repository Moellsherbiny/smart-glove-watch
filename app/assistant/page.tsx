"use client";

import { useState } from "react";
import { Bot, Loader2, SendHorizontal, Trash, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useEffect, useRef } from "react";
type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

const STORAGE_KEY = "lifesense_chat";

export default function AssistantPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);

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
  useEffect(() => {
    const saved = storage.get(STORAGE_KEY);

    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {
        storage.remove(STORAGE_KEY);

        setMessages([
          {
            id: 1,
            role: "assistant",
            content: "مرحباً 👋 كيف يمكنني مساعدتك اليوم؟",
          },
        ]);
      }
    } else {
      setMessages([
        {
          id: 1,
          role: "assistant",
          content: "مرحباً 👋 كيف يمكنني مساعدتك اليوم؟",
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (messages.length) {
      storage.set(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const sendMessage = async () => {
    if (loading) return;
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

    const currentHistory =
      messages.length > 0
        ? [
            ...messages,
            {
              id: Date.now(),
              role: "user",
              content: userMessage,
            },
          ]
        : [
            {
              id: Date.now(),
              role: "user",
              content: userMessage,
            },
          ];
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          history: currentHistory,
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
    } finally {
      setLoading(false);
    }
  };

  const prevLength = useRef(0);

  useEffect(() => {
    if (messages.length > prevLength.current) {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }

    prevLength.current = messages.length;
  }, [messages]);
  const clearChat = () => {
    storage.remove(STORAGE_KEY);

    setMessages([
      {
        id: 1,
        role: "assistant",
        content: "مرحباً 👋 كيف يمكنني مساعدتك اليوم؟",
      },
    ]);
  };

  const deleteMessage = (id: number) => {
    if (id === 1) return;

    setMessages((prev) => prev.filter((message) => message.id !== id));
  };
  return (
    <main className="flex h-dvh flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-md px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <Avatar>
              <AvatarFallback>
                <Bot className="size-5" />
              </AvatarFallback>
            </Avatar>

            <div className="text-center">
              <h1 className="font-bold">مساعد Life Sense</h1>

              <p className="text-xs text-green-600">Life Sense Ai</p>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Trash className="size-4" />
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent dir="rtl">
                <AlertDialogHeader>
                  <AlertDialogTitle>حذف المحادثة؟</AlertDialogTitle>

                  <AlertDialogDescription>
                    سيتم حذف جميع الرسائل بشكل نهائي.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>إلغاء</AlertDialogCancel>

                  <AlertDialogAction onClick={clearChat}>حذف</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
              <div className="flex items-center gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 shrink-0 text-muted-foreground"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent dir="rtl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>حذف الرسالة؟</AlertDialogTitle>

                      <AlertDialogDescription>
                        سيتم حذف هذه الرسالة نهائياً.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>إلغاء</AlertDialogCancel>

                      <AlertDialogAction
                        onClick={() => deleteMessage(message.id)}
                      >
                        حذف
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <div
                  className={`max-w-[90%] rounded-2xl px-4 py-3 text-[15px]
leading-8
tracking-wide shadow-md ${
                    message.role === "assistant"
                      ? "bg-muted border"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => (
                        <h1 className="mb-4 text-xl font-bold">{children}</h1>
                      ),

                      h2: ({ children }) => (
                        <h2 className="mb-3 text-lg font-semibold">
                          {children}
                        </h2>
                      ),

                      strong: ({ children }) => (
                        <strong className="font-bold">{children}</strong>
                      ),

                      blockquote: ({ children }) => (
                        <blockquote className="border-r-4 pr-4 italic my-4">
                          {children}
                        </blockquote>
                      ),
                      p: ({ children }) => (
                        <p className="leading-8">{children}</p>
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
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-end">
              <div className="bg-muted rounded-2xl px-5 py-4">
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
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t bg-background">
        <div className="mx-auto max-w-md p-4 pb-24">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder="اكتب رسالتك..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />

            <Button
              size="icon"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <SendHorizontal className="size-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
