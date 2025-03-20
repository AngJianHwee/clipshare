// src/app/message/[id]/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import Nav from '@/components/Nav';
import Link from 'next/link';

// Define the interface for the message
interface Message {
  id: string;
  content: string;
  timestamp: string;
  readableSlug: string;
  isPinned: boolean;
}

// Use a type that aligns with Client Component expectations
interface ClientPageProps {
  params: { id: string };
}

export default function MessagePage({ params }: ClientPageProps) {
  const [message, setMessage] = useState<Message | null>(null);

  useEffect(() => {
    async function fetchMessage() {
      const res = await fetch('/api/messages');
      const messages: Message[] = await res.json();
      const foundMessage = messages.find(msg => msg.id === params.id);
      if (!foundMessage) notFound();
      setMessage(foundMessage);
    }
    fetchMessage();
  }, [params.id]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!message) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Nav currentView="messages" />
        <div className="max-w-2xl mx-auto space-y-6">
          <Link href="/messages" passHref>
            <Button variant="ghost" className="!rounded-button hover:bg-gray-100">
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Messages
            </Button>
          </Link>
          <Card className="p-6 space-y-4 rounded-xl">
            <Textarea
              readOnly
              value={message.content}
              className="h-40 font-mono rounded-xl"
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Shared on {format(new Date(message.timestamp), 'MMM d, yyyy HH:mm')}
              </span>
              <Button
                onClick={() => copyToClipboard(message.content)}
                className="!rounded-button hover:bg-gray-100"
              >
                <i className="fas fa-copy mr-2"></i>
                Copy to Clipboard
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}