// src/app/api/messages/route.ts
import { NextResponse } from 'next/server';
import { connectRedis } from '@/lib/redis';
import { generateMessageId } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  timestamp: string;
  readableSlug: string;
  isPinned: boolean;
}

export async function GET() {
  const redis = await connectRedis();
  const keys = await redis.keys('message:*');
  const messages: Message[] = [];

  for (const key of keys) {
    const msg = await redis.hGetAll(key);
    messages.push({
      id: key.replace('message:', ''),
      content: msg.content,
      timestamp: msg.timestamp,
      readableSlug: msg.readableSlug,
      isPinned: msg.isPinned === 'true',
    });
  }

  messages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  const { content } = await request.json();
  if (!content) return NextResponse.json({ error: 'Content required' }, { status: 400 });

  const timestamp = new Date().toISOString();
  const id = generateMessageId(content, timestamp);
  const words = ['glowing', 'space', 'rotary', 'phone', 'cosmic', 'digital', 'cyber', 'quantum'];
  const readableSlug = Array(3).fill(null)
    .map(() => words[Math.floor(Math.random() * words.length)])
    .join('-');

  const message: Message = {
    id,
    content,
    timestamp,
    readableSlug,
    isPinned: false,
  };

  const redis = await connectRedis();
  await redis.hSet(`message:${id}`, {
    content,
    timestamp,
    readableSlug,
    isPinned: 'false',
  });

  return NextResponse.json(message);
}

export async function PATCH(request: Request) {
  const { id, isPinned } = await request.json();
  const redis = await connectRedis();
  await redis.hSet(`message:${id}`, 'isPinned', isPinned.toString());
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const redis = await connectRedis();

  if (id) {
    await redis.del(`message:${id}`);
  } else {
    const keys = await redis.keys('message:*');
    if (keys.length > 0) await redis.del(keys);
  }
  return NextResponse.json({ success: true });
}