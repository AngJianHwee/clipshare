// src/app/message/[id]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import Nav from '@/components/Nav';
import Link from 'next/link';
import { CopyButton } from './CopyButton';

// Define Message type
interface Message {
  id: string;
  content: string;
  timestamp: string;
  readableSlug: string;
  isPinned: boolean;
}

// Server-side fetch function to isolate data retrieval
async function fetchMessageById(id: string): Promise<Message> {
  console.log(`[${new Date().toISOString()}] Fetching messages for ID: ${id}`);
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages` || 'http://localhost:3000/api/messages', {
  // const res = await fetch('http://localhost:3000/api/messages', {
  // check if exist, if not, use the localhost
  var req_url = '';
  if (process.env.NEXT_PUBLIC_API_URL) {
    req_url = `${process.env.NEXT_PUBLIC_API_URL}/api/messages`;
  }
  else {
    req_url = 'http://localhost:3000/api/messages';
  }

  const res = await fetch(req_url, {
    cache: 'no-store', // Disable caching to ensure fresh data, per your "don't care if slower" preference
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch messages: ${res.status}`);
  }
  
  const messages: Message[] = await res.json();
  const message = messages.find((msg) => msg.id === id);
  
  if (!message) {
    console.log(`[${new Date().toISOString()}] Message not found for ID: ${id}`);
    notFound();
  }
  
  console.log(`[${new Date().toISOString()}] Successfully fetched message for ID: ${id}`);
  return message;
}

// Server-side component
export default async function MessagePage({ params }: { params: { id: string } }) {
  const message = await fetchMessageById(params.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900 overflow-x-hidden">
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
              rows={3}
              className="font-mono rounded-xl w-full whitespace-pre-wrap overflow-y-auto"
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Shared on {format(new Date(message.timestamp), 'MMM d, yyyy HH:mm')}
              </span>
              <CopyButton content={message.content} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}