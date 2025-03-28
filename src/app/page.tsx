// src/app/page.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { format } from 'date-fns';
import Nav from '@/components/Nav';

interface Message {
  id: string;
  content: string;
  timestamp: string;
  readableSlug: string;
  isPinned: boolean;
}

export default function Home() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [newMessage, setNewMessage] = useState('');
  const [hashLink, setHashLink] = useState('');
  const [readableLink, setReadableLink] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    fetchMessages();
    if (textareaRef.current) textareaRef.current.focus();
  }, []);

  const fetchMessages = async () => {
    const res = await fetch('/api/messages');
    const data = await res.json();
    setMessages(data);
    if (data.length === 0) seedInitialMessages();
  };

  const seedInitialMessages = async () => {
    const initialMessages: Omit<Message, 'id'>[] = [
      // {
      //   content: 'Important meeting notes from the quarterly review: Revenue increased by 25% YoY. New product launch scheduled for Q3 2025. Customer satisfaction score at 92%.',
      //   timestamp: '2025-03-14T09:30:00.000Z',
      //   readableSlug: 'quarterly-review-notes',
      //   isPinned: true,
      // },
      // {
      //   content: 'API Documentation v2.0: Updated endpoints for user authentication. Added rate limiting headers. Deprecated legacy payment methods.',
      //   timestamp: '2025-03-14T08:15:00.000Z',
      //   readableSlug: 'api-documentation',
      //   isPinned: false,
      // },
      // {
      //   content: 'Project timeline update: UI/UX redesign - March 20, Backend migration - April 5, Testing phase - April 15, Production deployment - May 1',
      //   timestamp: '2025-03-13T16:45:00.000Z',
      //   readableSlug: 'project-timeline',
      //   isPinned: false,
      // },
    ];

    for (const msg of initialMessages) {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: msg.content }),
      });
    }
    fetchMessages();
  };

  const generateLinks = async () => {
    if (!newMessage) return;

    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newMessage }),
    });
    const newMessageObj: Message = await res.json();

    const domain = `${window.location.protocol}//${window.location.host}`;
    setHashLink(`${domain}/message/${newMessageObj.id}`);
    setReadableLink(`${domain}/m/${newMessageObj.readableSlug}`);
    setMessages([newMessageObj, ...messages]);
    setNewMessage('');
  };

  const togglePin = async (id: string) => {
    const updatedMessages = messages.map(msg =>
      msg.id === id ? { ...msg, isPinned: !msg.isPinned } : msg
    );
    setMessages(updatedMessages);

    await fetch('/api/messages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isPinned: updatedMessages.find(msg => msg.id === id)?.isPinned }),
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const deleteMessage = async (id: string) => {
    await fetch('/api/messages', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setMessages(messages.filter(msg => msg.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Nav currentView="home" />
        <div className="space-y-8">
          <div className="max-w-2xl mx-auto space-y-4">
            {/* {messages.filter(msg => msg.isPinned).length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Pinned Message</h2>
                <Card className="p-4 bg-blue-50 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="font-mono text-sm line-clamp-2">
                        {messages.find(msg => msg.isPinned)?.content}
                      </div>
                      <div className="text-sm text-gray-500">
                        Pinned on {format(new Date(messages.find(msg => msg.isPinned)?.timestamp || ''), 'MMM d, yyyy HH:mm')}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="!rounded-button hover:bg-blue-100"
                        onClick={() => togglePin(messages.find(msg => msg.isPinned)?.id || '')}
                      >
                        <i className="fas fa-thumbtack text-blue-600"></i>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="!rounded-button"
                        onClick={() => deleteMessage(messages.find(msg => msg.isPinned)?.id || '')}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )} */}

            <label className="block text-lg font-medium mb-2">New Message</label>
            <Textarea
              ref={textareaRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Paste your content here..."
              className="h-40 font-mono rounded-xl focus:ring-2 focus:ring-blue-500"
            />
            <Button
              onClick={generateLinks}
              className="w-full !rounded-button bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all"
              size="lg"
            >
              <i className="fas fa-share-alt mr-2"></i>
              Share
            </Button>
          </div>

          {hashLink && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Hash Link</label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={hashLink}
                    className="font-mono rounded-xl"
                  />
                  <Button
                    onClick={() => copyToClipboard(hashLink)}
                    className="!rounded-button whitespace-nowrap hover:bg-gray-100"
                  >
                    <i className="fas fa-copy mr-2"></i>
                    Copy
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Readable Link</label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={readableLink}
                    className="font-mono rounded-xl"
                  />
                  <Button
                    onClick={() => copyToClipboard(readableLink)}
                    className="!rounded-button whitespace-nowrap hover:bg-gray-100"
                  >
                    <i className="fas fa-copy mr-2"></i>
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}