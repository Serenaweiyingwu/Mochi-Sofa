"use client";

import { Suspense } from "react";
import FurnitureCustomize from "./components/furniture";


export default function Page() {
    return <Suspense>
      <FurnitureCustomize/>
    </Suspense>
}