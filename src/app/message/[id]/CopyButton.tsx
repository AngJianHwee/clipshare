// Client-side component for interactivity
"use client";
import { Button } from '@/components/ui/button';


function CopyButton({ content }: { content: string }) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Button
      onClick={() => copyToClipboard(content)}
      className="!rounded-button hover:bg-gray-100"
    >
      <i className="fas fa-copy mr-2"></i>
      Copy to Clipboard
    </Button>
  );
}


export { CopyButton };