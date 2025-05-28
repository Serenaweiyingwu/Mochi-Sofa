"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const code = searchParams.get('code');
    
    if (code) {
      window.location.href = '/';
    }
  }, [searchParams]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4 bg-white">
      <div className="w-full max-w-md">
      </div>
    </div>
  );
}
