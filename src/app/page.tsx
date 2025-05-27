"use client";

import { useRef, useState } from "react";
import Scene from "./components/Scene";
import AddButton from "./components/AddButton";
import AddBackrestButton from "./components/AddBackrestButton";


export default function Page() {
    const [sceneAPI, setSceneAPI] = useState<{
        startPlacingSeat?: () => void;
        startPlacingBackrest?: () => void;
    }>({});

    return (
        <main className="relative">
            <Scene onSceneReady={setSceneAPI}/>
            {sceneAPI.startPlacingSeat && (
                <AddButton onClick={sceneAPI.startPlacingSeat}/>
            )}
            {sceneAPI.startPlacingBackrest && (
                <AddBackrestButton onClick={sceneAPI.startPlacingBackrest}/>
            )}
        </main>
    );
}