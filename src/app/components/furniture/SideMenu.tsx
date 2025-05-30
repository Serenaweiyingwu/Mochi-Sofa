import React from "react";
import LoginCard from "../login/LoginCard";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  showSocialLinks: boolean;
  toggleSocialLinks: () => void;
  menuView: "menu" | "login";
  setMenuView: (view: "menu" | "login") => void;
}

const SideMenu: React.FC<SideMenuProps> = ({
  isOpen,
  onClose,
  showSocialLinks,
  toggleSocialLinks,
  menuView,
  setMenuView,
}) => {
  return (
    <>
      {/* Side Menu Background Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-500 z-40 ${
          isOpen
            ? "bg-opacity-50 opacity-100"
            : "bg-opacity-0 opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Slide Panel Container */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full md:w-[400px] bg-white z-50 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="flex justify-end flex-col p-5 pb-0">
          <div className="flex flex-row justify-between">
            {menuView === "login" && (
              <button className="p-0" onClick={() => setMenuView("menu")}>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M26.7508 29.2384L16.8121 19.2997L26.7508 9.36099C27.7497 8.362 27.7497 6.74824 26.7508 5.74925C25.7518 4.75025 24.138 4.75025 23.139 5.74925L11.3816 17.5066C10.3826 18.5056 10.3826 20.1194 11.3816 21.1184L23.139 32.8758C24.138 33.8747 25.7518 33.8747 26.7508 32.8758C27.7241 31.8768 27.7497 30.2374 26.7508 29.2384Z"
                    fill="#333A3F"
                  />
                </svg>
              </button>
            )}
            <button
              className="p-0 ml-auto"
              onClick={() => {
                onClose();
                setMenuView("menu");
              }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M30 10L10 30"
                  stroke="#333A3F"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 10L30 30"
                  stroke="#333A3F"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 flex flex-col relative">
            <div
              className={`transition-all duration-500 absolute inset-0 ${
                menuView === "login"
                  ? "opacity-100 z-10 transform translate-x-0"
                  : "opacity-0 z-0 pointer-events-none transform translate-x-full"
              }`}
            >
              <LoginCard className="mx-auto" />
            </div>

            <nav
              className={`space-y-2 text-4xl font-bold w-full pl-12 mt-8 transition-all duration-500 absolute inset-0 ${
                menuView === "menu"
                  ? "opacity-100 z-10 transform translate-x-0"
                  : "opacity-0 z-0 pointer-events-none transform -translate-x-full"
              }`}
            >
              <div
                className="transition-opacity duration-300 delay-[0ms]"
                style={{ opacity: isOpen && menuView === "menu" ? 1 : 0 }}
              >
                <button
                  onClick={() => setMenuView("login")}
                  className="block p-0 text-left w-full text-4xl font-bold"
                >
                  Sign-up/Log in
                </button>
              </div>
              <div
                className="transition-opacity duration-300 delay-[50ms]"
                style={{ opacity: isOpen && menuView === "menu" ? 1 : 0 }}
              >
                <a href="/tetris" className="block">
                  Play Games
                </a>
              </div>
              <div
                className="transition-opacity duration-300 delay-[100ms]"
                style={{ opacity: isOpen && menuView === "menu" ? 1 : 0 }}
              >
                <a
                  href="https://aroomy.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  Aroomy App
                </a>
              </div>
              <div
                className="transition-opacity duration-300 delay-[150ms]"
                style={{ opacity: isOpen && menuView === "menu" ? 1 : 0 }}
              >
                <a
                  href="https://mall.aroomy.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  Aroomy Mall
                </a>
              </div>
              <div
                className="transition-opacity duration-300 delay-[200ms]"
                style={{ opacity: isOpen && menuView === "menu" ? 1 : 0 }}
              >
                <a
                  href="https://mall.aroomy.com/mochi-sofa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  Mochi Sofa
                </a>
              </div>
              <div
                className="transition-opacity duration-300 delay-[250ms]"
                style={{ opacity: isOpen && menuView === "menu" ? 1 : 0 }}
              >
                <a
                  href="https://aroomy.com/support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  Support
                </a>
              </div>
              <div
                className="transition-opacity duration-300 delay-[300ms]"
                style={{ opacity: isOpen && menuView === "menu" ? 1 : 0 }}
              >
                <button
                  onClick={toggleSocialLinks}
                  className="flex text-4xl font-bold pl-0 items-center justify-between w-full"
                >
                  <div>Social Media</div>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transform transition-transform duration-200 ${
                      showSocialLinks ? "rotate-180" : ""
                    }`}
                  >
                    <path
                      d="M7 10L12 15L17 10"
                      stroke="#333A3F"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <div
                  className={`pl-28 font-normal space-y-3 mt-3 text-2xl transition-all duration-1000 ${
                    showSocialLinks
                      ? "max-h-[500px]"
                      : "max-h-0 overflow-hidden"
                  }`}
                >
                  <div
                    className="transition-opacity duration-300 delay-[0ms]"
                    style={{ opacity: isOpen && showSocialLinks ? 1 : 0 }}
                  >
                    <a
                      href="https://www.instagram.com/aroomy.home"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      Instagram
                    </a>
                  </div>
                  <div
                    className="transition-opacity duration-300 delay-[50ms]"
                    style={{ opacity: isOpen && showSocialLinks ? 1 : 0 }}
                  >
                    <a
                      href="https://www.tiktok.com/@aroomy1home"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      TikTok
                    </a>
                  </div>
                  <div
                    className="transition-opacity duration-300 delay-[100ms]"
                    style={{ opacity: isOpen && showSocialLinks ? 1 : 0 }}
                  >
                    <a
                      href="https://www.youtube.com/@aroomyhome"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      YouTube
                    </a>
                  </div>
                  <div
                    className="transition-opacity duration-300 delay-[150ms]"
                    style={{ opacity: isOpen && showSocialLinks ? 1 : 0 }}
                  >
                    <a
                      href="https://x.com/AroomyHome"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      X
                    </a>
                  </div>
                  <div
                    className="transition-opacity duration-300 delay-[200ms]"
                    style={{ opacity: isOpen && showSocialLinks ? 1 : 0 }}
                  >
                    <a
                      href="https://www.pinterest.com/Aroomyhome"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      Pinterest
                    </a>
                  </div>
                  <div
                    className="transition-opacity duration-300 delay-[250ms]"
                    style={{ opacity: isOpen && showSocialLinks ? 1 : 0 }}
                  >
                    <a
                      href="https://www.facebook.com/aroomyhome"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      Facebook
                    </a>
                  </div>
                  <div
                    className="transition-opacity duration-300 delay-[300ms]"
                    style={{ opacity: isOpen && showSocialLinks ? 1 : 0 }}
                  >
                    <a
                      href="https://www.linkedin.com/company/aroomy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
