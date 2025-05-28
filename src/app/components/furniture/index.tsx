import React, { useState, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import LoginCard from "../login/LoginCard";
import Scene from "../Scene";

const FurnitureCustomize = () => {
  const [sceneAPI, setSceneAPI] = useState<{
    startPlacingSeat?: () => void;
    startPlacingBackrest?: () => void;
  }>({});
  const [selectedCategory, setSelectedCategory] = useState("sofa");
  const [selectedColor, setSelectedColor] = useState("#FFD763"); // Default to first color (yellow)
  const [showBanner, setShowBanner] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showSocialLinks, setShowSocialLinks] = useState(false);
  const [menuView, setMenuView] = useState<'menu' | 'login'>('menu');
  const colorContainerRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: "sofa", label: "Sofa" },
    { id: "backrest", label: "Backrest" },
  ];

  const colors = [
    { id: "yellow", value: "#FFD763" },
    { id: "cream", value: "#F5EFE0" },
    { id: "lightBlue", value: "#5FB4D0" },
    { id: "darkBlue", value: "#0C2B4B" },
    { id: "skyBlue", value: "#CBE9F6" },
    // Add more color options as needed
  ];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleColorSelect = (colorValue: string) => {
    setSelectedColor(colorValue);
  };

  const handleComplete = () => {
    // Handle completion logic here
    console.log("Completed with:", { selectedCategory, selectedColor });
    // Navigate to next page or show confirmation
  };

  const handleColorScroll = () => {
    if (colorContainerRef.current) {
      colorContainerRef.current.scrollBy({ left: 60, behavior: 'smooth' });
    }
  };

  return (
    <>
      <Head>
        <title>Customize Furniture | Aroomy</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
      </Head>

      <div className="flex flex-col h-full min-h-screen bg-white relative">
        {/* Header */}
        <header className="px-5 py-6 flex justify-between items-center">
          <div className="w-40">
            <Image
              src="/images/logo/logo.png"
              alt="Aroomy"
              width={150}
              height={42}
              priority
            />
          </div>
          <div className="flex items-center">
            <button className="relative p-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M9.5 21C10.3284 21 11 20.3284 11 19.5C11 18.6716 10.3284 18 9.5 18C8.67157 18 8 18.6716 8 19.5C8 20.3284 8.67157 21 9.5 21Z" fill="#1A305B" />
                <path fillRule="evenodd" clipRule="evenodd" d="M17.5 21C18.3284 21 19 20.3284 19 19.5C19 18.6716 18.3284 18 17.5 18C16.6716 18 16 18.6716 16 19.5C16 20.3284 16.6716 21 17.5 21Z" fill="#1A305B" />
                <path d="M3 3C2.44772 3 2 3.44772 2 4C2 4.55228 2.44772 5 3 5H3.43845C3.89731 5 4.2973 5.3123 4.40859 5.75746L6.65112 14.7276C6.985 16.0631 8.18495 17 9.56155 17H17.3957C18.8018 17 20.0192 16.0234 20.3242 14.6508L21.4353 9.65079C21.8517 7.77725 20.426 6 18.5068 6H6.53078L6.34888 5.27239C6.015 3.93689 4.81505 3 3.43845 3H3Z" fill="#1A305B" />
              </svg>

            </button>
            <button className="p-2 ml-2" onClick={() => setShowMenu(true)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M4 16C4 15.4477 4.44772 15 5 15H19C19.5523 15 20 15.4477 20 16C20 16.5523 19.5523 17 19 17H5C4.44772 17 4 16.5523 4 16Z" fill="#1A305B" />
                <path fillRule="evenodd" clipRule="evenodd" d="M4 8C4 7.44772 4.44772 7 5 7H19C19.5523 7 20 7.44772 20 8C20 8.55228 19.5523 9 19 9H5C4.44772 9 4 8.55228 4 8Z" fill="#1A305B" />
              </svg>
            </button>
          </div>
        </header>

        {/* Notification Banner */}
        <div className="flex-col flex relative" style={{ height: 'calc(100vh - 88px - 416px)' }}>
          <div className="flex absolute top-0 left-0 right-0 justify-center px-4 items-center h-10">
            {showBanner && (
              <div className="bg-[#CBF1FF] w-full px-5 py-1.5 text-xl font-normal font-nunito flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-blue-500 mr-2">
                    <svg
                      width="22"
                      height="21"
                      viewBox="0 0 22 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8.315 6.08365C11.1956 2.38296 15.6946 0.000214401 20.75 6.69843e-10C20.9489 -8.40157e-06 21.1397 0.0790055 21.2803 0.219659C21.421 0.360312 21.5 0.551082 21.5 0.75C21.5 5.80564 19.1173 10.305 15.4165 13.1859C15.4715 13.5329 15.5 13.8883 15.5 14.25C15.5 17.9779 12.4779 21 8.75 21C8.33579 21 8 20.6642 8 20.25V16.1185C7.99075 16.1118 7.98163 16.1049 7.97264 16.0978C7.02063 15.3429 6.15799 14.4803 5.40312 13.5282C5.39577 13.519 5.38866 13.5096 5.38179 13.5H1.25C0.835786 13.5 0.5 13.1642 0.5 12.75C0.5 9.02208 3.52208 6 7.25 6C7.61198 6 7.96772 6.02856 8.315 6.08365ZM14 5.25C12.7574 5.25 11.75 6.25736 11.75 7.5C11.75 8.74264 12.7574 9.75 14 9.75C15.2426 9.75 16.25 8.74264 16.25 7.5C16.25 6.25736 15.2426 5.25 14 5.25Z"
                        fill="#5CB2D1"
                      />
                      <path
                        d="M4.26036 15.7418C4.59237 15.4942 4.66074 15.0242 4.41306 14.6922C4.16539 14.3602 3.69546 14.2918 3.36345 14.5395C2.08209 15.4954 1.25 17.0256 1.25 18.7499C1.25 19.0255 1.27129 19.2966 1.31246 19.5615C1.36259 19.8842 1.61574 20.1373 1.93842 20.1875C2.20336 20.2286 2.47445 20.2499 2.75 20.2499C4.47434 20.2499 6.00452 19.4178 6.9604 18.1365C7.20808 17.8045 7.13971 17.3345 6.8077 17.0869C6.47569 16.8392 6.00576 16.9075 5.75809 17.2396C5.07313 18.1577 3.98081 18.7499 2.75 18.7499C2.75 17.5191 3.34218 16.4268 4.26036 15.7418Z"
                        fill="#5CB2D1"
                      />
                    </svg>
                  </span>
                  <p className="">Score Deals While You Play</p>
                </div>
                <button
                  onClick={() => setShowBanner(false)}
                  className="text-gray-500 p-0"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                      fill="#6B7280"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
          <div className="h-full">
            <div className="h-full w-full">
              <Scene onSceneReady={setSceneAPI} />
            </div>
          </div>
        </div>

        <main className="px-6 py-8">
          {/* Categories */}
          <div className="mb-8 flex gap-3">
            {categories.map((category) => (
              <div key={category.id} className="flex flex-col items-center">
                <button
                  onClick={() => {
                    category.id === "sofa" ? sceneAPI.startPlacingSeat?.() : sceneAPI.startPlacingBackrest?.();
                  }}
                  key={category.id}
                  className={`relative flex p-0 w-24 h-20 flex-col items-center justify-center rounded-[20px] border-2 overflow-hidden border-[#5CB2D180]`}
                ></button>
                <span className="text-center text-xl font-normal mt-1">
                  {category.label}
                </span>
              </div>
            ))}
          </div>

          {/* Color Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-extrabold mb-3">Color</h2>
            <div className="flex">
              <div ref={colorContainerRef} className="flex items-center gap-6 overflow-x-auto py-2 px-1 scroll-smooth">
                {colors.map((color, index) => (
                  <button
                    key={color.id}
                    className={`w-10 h-10 p-0 rounded-full border-[#E6E6E6] flex-shrink-0 ${selectedColor === color.value
                      ? "border-4"
                      : "border-1"
                      }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => handleColorSelect(color.value)}
                    aria-label={`Select ${color.id} color`}
                  >
                    {index < 5 && (
                      <span className="sr-only">{color.id} color</span>
                    )}
                  </button>
                ))}
              </div>
              <button
                onClick={handleColorScroll}
                className="flex-shrink-0 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity ml-1"
                aria-label="Scroll colors"
              >
                <svg width="21" height="32" viewBox="0 0 21 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="20.5" y="31" width="20" height="30" rx="10" transform="rotate(180 20.5 31)" fill="white" stroke="#DAE8EE" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M8.40717 21.9053C8.11428 21.6124 8.11428 21.1376 8.40717 20.8447L12.7518 16.5L8.40717 12.1553C8.11428 11.8624 8.11428 11.3876 8.40717 11.0947C8.70006 10.8018 9.17494 10.8018 9.46783 11.0947L13.8125 15.4393C14.3983 16.0251 14.3983 16.9749 13.8125 17.5607L9.46783 21.9053C9.17494 22.1982 8.70006 22.1982 8.40717 21.9053Z" fill="#6F767E" />
                </svg>
              </button>
            </div>
          </div>
          <div className="px-6 py-8 pt-0">
            <button
              onClick={handleComplete}
              className="w-full py-3 px-4 bg-[#5CB2D1] text-white font-medium rounded-md transition duration-200"
            >
              Complete
            </button>
          </div>
        </main>

        {/* Complete Button */}
      </div>

      {/* Side Menu Background Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-500 z-40 ${showMenu ? 'bg-opacity-50 opacity-100' : 'bg-opacity-0 opacity-0 pointer-events-none'}`}
        onClick={() => setShowMenu(false)}
      />

      {/* Slide Panel Container */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full md:w-[400px] bg-white z-50 flex flex-col overflow-y-auto transition-transform duration-500 ease-in-out ${showMenu ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="flex justify-end flex-col p-5 pb-0">
          <div className="flex flex-row justify-between">
            {menuView === 'login' && (
              <button className="p-0" onClick={() => setMenuView('menu')}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M26.7508 29.2384L16.8121 19.2997L26.7508 9.36099C27.7497 8.362 27.7497 6.74824 26.7508 5.74925C25.7518 4.75025 24.138 4.75025 23.139 5.74925L11.3816 17.5066C10.3826 18.5056 10.3826 20.1194 11.3816 21.1184L23.139 32.8758C24.138 33.8747 25.7518 33.8747 26.7508 32.8758C27.7241 31.8768 27.7497 30.2374 26.7508 29.2384Z" fill="#333A3F" />
                </svg>
              </button>
            )}
            <button className="p-0 ml-auto" onClick={() => {
              setShowMenu(false)
              setMenuView('menu')
            }}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M30 10L10 30" stroke="#333A3F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 10L30 30" stroke="#333A3F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="flex-1 flex flex-col relative">
            <div className={`transition-opacity duration-1000 absolute inset-0 ${menuView === 'login' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
              <LoginCard className="mx-auto" />
            </div>

            <nav className={`space-y-2 text-4xl font-bold w-full pl-12 mt-8 transition-opacity duration-1000 absolute inset-0 ${menuView === 'menu' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>

              <div><button onClick={() => setMenuView('login')} className="block p-0 text-left w-full text-4xl font-bold">Sign-up/Log in</button></div>
              <div><a href="#" className="block">Play Games</a></div>
              <div><a href="https://aroomy.com" target="_blank" rel="noopener noreferrer" className="block">Aroomy App</a></div>
              <div><a href="https://mall.aroomy.com" target="_blank" rel="noopener noreferrer" className="block">Aroomy Mall</a></div>
              <div><a href="https://mall.aroomy.com/mochi-sofa" target="_blank" rel="noopener noreferrer" className="block">Mochi Sofa</a></div>
              <div><a href="https://aroomy.com/support" target="_blank" rel="noopener noreferrer" className="block">Support</a></div>
              <div>
                <button
                  onClick={() => setShowSocialLinks(!showSocialLinks)}
                  className="flex text-4xl font-bold pl-0 items-center justify-between w-full"
                >
                  <div>Social Media</div>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transform transition-transform duration-200 ${showSocialLinks ? 'rotate-180' : ''}`}
                  >
                    <path d="M7 10L12 15L17 10" stroke="#333A3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className={`pl-28 font-normal space-y-3 mt-3 text-2xl transition-all duration-1000 ${showSocialLinks ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                  <div><a href="https://www.instagram.com/aroomy.home" target="_blank" rel="noopener noreferrer" className="block">Instagram</a></div>
                  <div><a href="https://www.tiktok.com/@aroomy1home" target="_blank" rel="noopener noreferrer" className="block">TikTok</a></div>
                  <div><a href="https://www.youtube.com/@aroomyhome" target="_blank" rel="noopener noreferrer" className="block">YouTube</a></div>
                  <div><a href="https://x.com/AroomyHome" target="_blank" rel="noopener noreferrer" className="block">X</a></div>
                  <div><a href="https://www.pinterest.com/Aroomyhome" target="_blank" rel="noopener noreferrer" className="block">Pinterest</a></div>
                  <div><a href="https://www.facebook.com/aroomyhome" target="_blank" rel="noopener noreferrer" className="block">Facebook</a></div>
                  <div><a href="https://www.linkedin.com/company/aroomy" target="_blank" rel="noopener noreferrer" className="block">LinkedIn</a></div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default FurnitureCustomize;
