// src/app/messages/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from 'date-fns';
import Nav from '@/components/Nav';
import Link from 'next/link';

interface Message {
  id: string;
  content: string;
  timestamp: string;
  readableSlug: string;
  isPinned: boolean;
}

function reorderMessages(messages: Message[]) {
  const messages_copy = [...messages];
  const pinned = messages_copy.filter(msg => msg.isPinned);
  const unpinned = messages_copy.filter(msg => !msg.isPinned);
  return [...pinned, ...unpinned];
}

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const res = await fetch('/api/messages');
    const data = await res.json();
    setMessages(data);
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

  const deleteMessage = async (id: string) => {
    await fetch('/api/messages', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setMessages(messages.filter(msg => msg.id !== id));
  };

  const clearAllMessages = async () => {
    await fetch('/api/messages', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    setMessages([]);
    setShowDeleteModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Nav currentView="messages" />
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">All Messages</h2>
            <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="!rounded-button">
                  <i className="fas fa-trash-alt mr-2"></i>
                  Clear All
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-xl">
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p>This will permanently delete all messages. This action cannot be undone.</p>
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteModal(false)}
                      className="!rounded-button"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={clearAllMessages}
                      className="!rounded-button"
                    >
                      Delete All
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <ScrollArea className="h-[600px] rounded-xl border p-4 bg-white">
            <div className="grid gap-4">


              {reorderMessages(messages).map((message) => (
                <Card key={message.id} className="p-4 rounded-xl hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="font-mono text-sm line-clamp-2">{message.content}</div>
                      <div className="text-sm text-gray-500">
                        Shared on {format(new Date(message.timestamp), 'MMM d, yyyy HH:mm')}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/message/${message.id}`} passHref>
                        <Button
                          variant="outline"
                          size="sm"
                          className="!rounded-button hover:bg-gray-100"
                        >
                          <i className="fas fa-eye mr-2"></i>
                          View
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="!rounded-button hover:bg-gray-100"
                        onClick={() => togglePin(message.id)}
                      >
                        <i className={`fas fa-thumbtack ${message.isPinned ? 'text-blue-600' : ''}`}></i>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="!rounded-button"
                        onClick={() => deleteMessage(message.id)}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}