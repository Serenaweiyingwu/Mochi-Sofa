"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import TetrisGame from '@/app/components/tetris/TetrisGame';

export default function TetrisPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showLoginAlert, setShowLoginAlert] = useState<boolean>(false);
  
  useEffect(() => {
    const userInfo = localStorage.getItem('user_info');
    if (userInfo) {
      setIsLoggedIn(true);
    } else {
      setShowLoginAlert(true);
      const timer = setTimeout(() => {
        router.push('/');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [router]);
  
  useEffect(() => {
    const invite = searchParams?.get('invite');
    if (invite && isLoggedIn) {
      const userInfo = localStorage.getItem('user_info');
      if (userInfo) {
        const user = JSON.parse(userInfo);
        
        if (invite !== user.id) {
          setInviteCode(invite);
          localStorage.setItem('invitedBy', invite);
        } else {
          if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.delete('invite');
            window.history.replaceState({}, '', url.toString());
          }
        }
      }
    }
  }, [searchParams, isLoggedIn]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      {showLoginAlert && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-4 text-center z-50">
          Please log in before playing the game! Returning to homepage...
        </div>
      )}
      
      <div className="flex max-w-4xl w-full">
        {isLoggedIn ? (
          <TetrisGame inviteCode={inviteCode} />
        ) : (
          <div className="w-full bg-white rounded-lg p-8 text-center shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
            <p className="text-gray-600 mb-6">You need to log in to play the Tetris game</p>
            <p className="text-gray-500">Returning to homepage...</p>
          </div>
        )}
      </div>
    </div>
  );
}
