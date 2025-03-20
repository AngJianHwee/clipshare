// src/app/m/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Nav from '@/components/Nav';
import Link from 'next/link';

interface Message {
  id: string;
  content: string;
  timestamp: string;
  readableSlug: string;
  isPinned: boolean;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/messages`);
  const messages: Message[] = await res.json();
  const message = messages.find(msg => msg.readableSlug === params.slug);

  return {
    title: message ? `ClipShare - ${message.readableSlug}` : 'Message Not Found',
  };
}

export default async function ReadableLinkPage({ params }: { params: { slug: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/messages`);
  if (!res.ok) throw new Error('Failed to fetch messages');
  const messages: Message[] = await res.json();
  const message = messages.find(msg => msg.readableSlug === params.slug);

  if (!message) notFound();

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
              <Button className="!rounded-button hover:bg-gray-100" disabled>
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