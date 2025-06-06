import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Scene from "../Scene";
import DesignScoreModal from "./DesignScoreModal";
import SideMenu from "./SideMenu";
import {
  useAddtoCart,
  useCheckout,
  useGetCart,
  useGetCartLink,
  useGetColorQuery,
} from "@/api/aroomy-api";

const FurnitureCustomize = () => {
  const [sceneAPI, setSceneAPI] = useState<{
    startPlacingSeat?: (selectedColorName: string) => void;
    startPlacingBackrest?: (selectedColorName: string) => void;
  }>({});
  const [getCart] = useGetCart();
  const [checkout] = useCheckout();
  const [addToCart] = useAddtoCart();
  const [getCartLink] = useGetCartLink();
  const [selectedCategory] = useState("sofa");
  const [selectedColor, setSelectedColor] = useState("#FFD763");
  const [selectedColorName, setSelectedColorName] = useState("Grayish Brown");
  const [showBanner, setShowBanner] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showSocialLinks, setShowSocialLinks] = useState(false);
  const [showDesignScore, setShowDesignScore] = useState(false);
  const [showDiscount, setShowDiscount] = useState(false);
  const [cartId, setCartId] = useState<string | null>(null);
  const [variantId, setVariantId] = useState<number | null>(null);
  const [getColors] = useGetColorQuery();
  const [colors, setColors] = useState<{ id: string; value: string, variantId: number }[]>([]);
  const [menuView, setMenuView] = useState<"menu" | "login">("menu");
  const colorContainerRef = useRef<HTMLDivElement>(null);


  const categories = [
    { id: "sofa", label: "Sofa" },
    { id: "backrest", label: "Backrest" },
  ];

  const colorsMap = [
    { id: "Grayish Brown", value: "#72675b" },
    { id: "Dark Gray", value: "#4a4a4a" },
    { id: "Dark Brown", value: "#3d2b1f" },
    { id: "Deep Red", value: "#8b0000" },
    { id: "Red", value: "#ff0000" },
    { id: "Orange", value: "#ffa500" },
    { id: "Mustard Yellow", value: "#ffdb58" },
    { id: "Pale Aqua", value: "#bcd4e6" },
    { id: "Light Grayish Green", value: "#c8d6c6" },
    { id: "Olive Green", value: "#708238" },
    { id: "Deep Cyan Green", value: "#008b8b" },
    { id: "Deep Cyan Blue", value: "#0e4d92" },
    { id: "Sky Blue", value: "#87ceeb" },
    { id: "Dusty Blue", value: "#5a7684" },
    { id: "Light Blue", value: "#add8e6" },
    { id: "Light Pink", value: "#ffb6c1" },
    { id: "Dirty Pink", value: "#c08081" },
    { id: "Light Gray", value: "#d3d3d3" },
    { id: "Charcoal Gray", value: "#36454f" },
    { id: "Light Grey Blue", value: "#a3b6c4" },
    { id: "Mist Blue", value: "#646d8c" },
    { id: "Deep Navy Blue", value: "#000080" },
  ];
  const fetchCart = async () => {
    try {
      const response = await getCart();
      setCartId(response.id);
      console.log("Cart data fetched:", response);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  const fetchColors = async () => {
    try {
      const response = await getColors();
      console.log(response.product);
      const colors = colorsMap.filter((color) =>
        response.product.variants.some((variant: { option1: string }) =>
          variant.option1 === color.id
        )
      ).map((color) => {
        const variant = response.product.variants.find((variant: { option1: string }) => variant.option1 === color.id);
        return { ...color, variantId: variant ? variant.id : null };
      });
      setColors(colors);
    } catch (error) {
      console.error("Error fetching colors:", error);
    }
  };

  useEffect(() => {
    // Fetch cart data when component mounts
    fetchCart();
    fetchColors();
  }, []);

  const handleColorSelect = (colorValue: string, colorName: string, variantId: number) => {
    setSelectedColor(colorValue);
    setSelectedColorName(colorName);
    setVariantId(variantId);
  };

  const handleComplete = () => {
    // Show the design score modal
    setShowDesignScore(true);
    console.log("Completed with:", { selectedCategory, selectedColor });
  };

  const handleApplyDiscount = () => {
    // Toggle discount display
    setShowDiscount(!showDiscount);
    console.log("Applying bonus discount");
  };

  const handleCheckout = () => {
    // Checkout logic here
    if (!cartId) {
      console.error("No cart ID available for checkout");
      return;
    }
    console.log("Proceeding to checkout");
    checkout(cartId)
      .then((response) => {
        // Redirect to the checkout URL
        if (response && response.checkout_url) {
          window.open(response.checkout_url, "_blank");
        }
      })
      .catch((error) => {
        console.error("Checkout error:", error);
      });
    setShowDesignScore(false);
  };

  const handleColorScroll = () => {
    if (colorContainerRef.current) {
      colorContainerRef.current.scrollBy({ left: 60, behavior: "smooth" });
    }
  };

  function toggleSocialLinks(): void {
    setShowSocialLinks(!showSocialLinks);
  }

  return (
    <>
      <div className="flex flex-col h-full min-h-screen bg-white relative">
        {/* Header */}
        <header className="px-5 py-6 flex items-center header justify-between bg-white w-full">
          <div className="w-40">
            <Image
              src="/images/logo/logo.png"
              alt="Aroomy"
              width={150}
              height={42}
              priority
            />
          </div>
          <div className="hidden flex-row header-menu gap-4">
          <div>
              <a href="/login" className="text-black font-extrabold text-xl">
              Sign-up/Log in
              </a>
            </div>
            <div>
              <a href="/tetris" className="text-black font-extrabold text-xl">
                Play Games
              </a>
            </div>
            <div>
              <a
                href="https://mall.aroomy.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black font-extrabold text-xl"
              >
                Aroomy Mall
              </a>
            </div>
            <div>
              <a
                href="https://mall.aroomy.com/mochi-sofa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black font-extrabold text-xl"
              >
                Mochi Sofa
              </a>
            </div>
            <div>
              <a
                href="https://aroomy.com/support"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black font-extrabold text-xl"
              >
                Support
              </a>
            </div>
          </div>
          <div className="flex header-cart items-center">
            <button
              onClick={() => {
                if (!cartId) {
                  window.open("https://281ca3-aa.myshopify.com/cart", "_blank");
                  return;
                }
                getCartLink(cartId)
                  .then((response) => {
                    if (response && response.cart_url) {
                      window.open(response.cart_url, "_blank");
                    }
                  })
                  .catch((error) => {
                    console.error("Error fetching cart link:", error);
                  });
              }}
              className="relative p-2"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.5 21C10.3284 21 11 20.3284 11 19.5C11 18.6716 10.3284 18 9.5 18C8.67157 18 8 18.6716 8 19.5C8 20.3284 8.67157 21 9.5 21Z"
                  fill="#1A305B"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M17.5 21C18.3284 21 19 20.3284 19 19.5C19 18.6716 18.3284 18 17.5 18C16.6716 18 16 18.6716 16 19.5C16 20.3284 16.6716 21 17.5 21Z"
                  fill="#1A305B"
                />
                <path
                  d="M3 3C2.44772 3 2 3.44772 2 4C2 4.55228 2.44772 5 3 5H3.43845C3.89731 5 4.2973 5.3123 4.40859 5.75746L6.65112 14.7276C6.985 16.0631 8.18495 17 9.56155 17H17.3957C18.8018 17 20.0192 16.0234 20.3242 14.6508L21.4353 9.65079C21.8517 7.77725 20.426 6 18.5068 6H6.53078L6.34888 5.27239C6.015 3.93689 4.81505 3 3.43845 3H3Z"
                  fill="#1A305B"
                />
              </svg>
            </button>
            <button className="p-2 ml-2" onClick={() => setShowMenu(true)}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4 16C4 15.4477 4.44772 15 5 15H19C19.5523 15 20 15.4477 20 16C20 16.5523 19.5523 17 19 17H5C4.44772 17 4 16.5523 4 16Z"
                  fill="#1A305B"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4 8C4 7.44772 4.44772 7 5 7H19C19.5523 7 20 7.44772 20 8C20 8.55228 19.5523 9 19 9H5C4.44772 9 4 8.55228 4 8Z"
                  fill="#1A305B"
                />
              </svg>
            </button>
          </div>
        </header>

        {/* Notification Banner */}
        <div
          className="flex-col flex relative"
          style={{ height: "calc(100vh - 88px - 416px)" }}
        >
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
            {categories.map((category) => {
              const imageName = `${selectedColorName}_${category.label}.png`;
              const imagePath = `/preview/${imageName}`;

              return (
                  <div key={category.id} className="flex flex-col items-center">
                    <button
                        onClick={() => {
                          if (category.id === "sofa") {
                            sceneAPI?.startPlacingSeat?.(selectedColorName);
                            const cartItem = {
                              variant_id:
                                `gid://shopify/ProductVariant/${variantId}`,
                              quantity: 1,
                              properties: {
                                title: selectedColorName,
                                variant: selectedColorName,
                                image: "",
                              },
                            };
                            addToCart(cartItem);
                          } else {
                            sceneAPI?.startPlacingBackrest?.(selectedColorName);
                          }
                        }}
                        key={category.id}
                        className={`relative flex p-0 w-24 h-20 flex-col items-center justify-center rounded-[20px] border-2 overflow-hidden border-[#5CB2D180]`}
                        style={{
                          backgroundImage: `url(${imagePath})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                        }}
                        aria-label={`Preview of ${selectedColorName} ${category.label}`}
                    ></button>
                    <span className="text-center text-xl font-normal mt-1">
          {category.label}
        </span>
                  </div>
              );
            })}
          </div>

          {/* Color Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-extrabold mb-3">Color</h2>
            <div className="flex">
              <div
                  ref={colorContainerRef}
                  className="flex items-center gap-6 overflow-x-auto py-2 px-1 scroll-smooth"
              >
                {colors.map((color, index) => (
                    <button
                        key={color.id}
                        className={`w-10 h-10 p-0 rounded-full border-[#E6E6E6] flex-shrink-0 ${
                            selectedColor === color.value ? "border-4" : "border-1"
                        }`}
                        style={{backgroundColor: color.value}}
                        onClick={() => handleColorSelect(color.value, color.id, color.variantId)}
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
                <svg
                    width="21"
                    height="32"
                    viewBox="0 0 21 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                      x="20.5"
                      y="31"
                      width="20"
                      height="30"
                      rx="10"
                      transform="rotate(180 20.5 31)"
                      fill="white"
                      stroke="#DAE8EE"
                  />
                  <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.40717 21.9053C8.11428 21.6124 8.11428 21.1376 8.40717 20.8447L12.7518 16.5L8.40717 12.1553C8.11428 11.8624 8.11428 11.3876 8.40717 11.0947C8.70006 10.8018 9.17494 10.8018 9.46783 11.0947L13.8125 15.4393C14.3983 16.0251 14.3983 16.9749 13.8125 17.5607L9.46783 21.9053C9.17494 22.1982 8.70006 22.1982 8.40717 21.9053Z"
                      fill="#6F767E"
                  />
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

      {/* Design Score Modal */}
      <DesignScoreModal
          isOpen={showDesignScore}
          onClose={() => {
            setShowDesignScore(false);
            setShowDiscount(false);
          }}
          onApplyDiscount={handleApplyDiscount}
          onCheckout={handleCheckout}
          showDiscount={showDiscount}
      />

      {/* Side Menu Background Overlay */}
      <div
          className={`fixed inset-0 bg-black transition-opacity duration-500 z-40 ${
              showMenu
                  ? "bg-opacity-50 opacity-100"
                  : "bg-opacity-0 opacity-0 pointer-events-none"
          }`}
          onClick={() => setShowMenu(false)}
      />

      {/* Slide Panel Container */}
      <SideMenu
          isOpen={showMenu}
          onClose={() => setShowMenu(false)}
          showSocialLinks={showSocialLinks}
          toggleSocialLinks={toggleSocialLinks}
          menuView={menuView}
          setMenuView={setMenuView}
      />
    </>
  );
};

export default FurnitureCustomize;
