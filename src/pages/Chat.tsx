"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SendHorizonal } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

type Message = {
  id: number;
  sender: "You" | "Mom" | "Dad";
  avatar: string;
  content: string;
  timestamp: string;
};

const initialMessages: Message[] = [
  { id: 1, sender: "Mom", avatar: "/avatars/02.png", content: "Hey everyone, don't forget we have dinner at grandma's on Sunday!", timestamp: "10:30 AM" },
  { id: 2, sender: "Dad", avatar: "/avatars/03.png", content: "Thanks for the reminder! What time?", timestamp: "10:31 AM" },
  { id: 3, sender: "You", avatar: "/avatars/01.png", content: "I'll be there. I can bring a dessert.", timestamp: "10:32 AM" },
  { id: 4, sender: "Mom", avatar: "/avatars/02.png", content: "6 PM. And that would be lovely, sweetie!", timestamp: "10:33 AM" },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message: Message = {
        id: messages.length + 1,
        sender: "You",
        avatar: "/avatars/01.png",
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 h-[calc(100vh-4rem)] flex flex-col">
      <div className="space-y-2 mb-4">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Family Chat</h1>
        <p className="text-muted-foreground">
          Stay connected with your loved ones.
        </p>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 p-6 space-y-6 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-end gap-3",
                message.sender === "You" && "justify-end"
              )}
            >
              {message.sender !== "You" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.avatar} />
                  <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div className={cn("max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2",
                message.sender === "You" ? "bg-primary text-primary-foreground" : "bg-muted"
              )}>
                <p className="text-sm">{message.content}</p>
                <p className={cn("text-xs mt-1", message.sender === "You" ? "text-primary-foreground/70" : "text-muted-foreground")}>
                  {message.sender}, {message.timestamp}
                </p>
              </div>
              {message.sender === "You" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.avatar} />
                  <AvatarFallback>Y</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </CardContent>
        <CardFooter className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <SendHorizonal className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
