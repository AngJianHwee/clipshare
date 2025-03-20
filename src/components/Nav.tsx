// src/components/Nav.tsx
"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

interface NavProps {
  currentView: 'home' | 'messages';
  setCurrentView?: (view: 'home' | 'messages') => void; // Optional for pages with state
}

const Nav: React.FC<NavProps> = ({ currentView, setCurrentView }) => {
  return (
    <nav className="flex justify-between items-center mb-12 bg-white rounded-xl p-4 shadow-sm">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        ClipShare
      </h1>
      <div className="space-x-4">
        {setCurrentView ? (
          <>
            <Button
              variant="ghost"
              className="!rounded-button hover:bg-gray-100 transition-colors"
              onClick={() => setCurrentView('home')}
            >
              Home
            </Button>
            <Button
              variant="ghost"
              className="!rounded-button hover:bg-gray-100 transition-colors"
              onClick={() => setCurrentView('messages')}
            >
              Messages
            </Button>
          </>
        ) : (
          <>
            <Link href="/" passHref>
              <Button
                variant="ghost"
                className={`!rounded-button hover:bg-gray-100 transition-colors ${currentView === 'home' ? 'text-blue-600' : ''}`}
              >
                Home
              </Button>
            </Link>
            <Link href="/messages" passHref>
              <Button
                variant="ghost"
                className={`!rounded-button hover:bg-gray-100 transition-colors ${currentView === 'messages' ? 'text-blue-600' : ''}`}
              >
                Messages
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;