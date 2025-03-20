// src/lib/utils.ts
import { createHash } from 'crypto';

export function generateMessageId(content: string, timestamp: string): string {
  const data = `${content}-${timestamp}`;
  return createHash('sha256').update(data).digest('hex').substring(0, 8); // 8-char hash
}

// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}