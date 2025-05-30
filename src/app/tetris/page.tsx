"use client";

import React from 'react';
import TetrisGame from '@/app/components/tetris/TetrisGame';

export default function TetrisPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="flex max-w-4xl w-full">
        <TetrisGame />
      </div>
    </div>
  );
}
