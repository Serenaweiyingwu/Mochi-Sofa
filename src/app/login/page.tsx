"use client";

import React, { Suspense } from "react";
import LoginCard from "../components/login/LoginCard";

export default function LoginPage() {

  
  return (
    <Suspense>
      <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4 bg-white">
        <div className="w-full max-w-md">
        </div>
        <LoginCard />
      </div>
    </Suspense>
  );
}
