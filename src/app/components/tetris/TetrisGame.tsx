"use client";

import React, { useState, useEffect, useRef } from "react";
import Tetris from "react-tetris";
import GameOverModal from "./GameOverModal";
import RulesModal from "./RulesModal";
import InviteModal from "./InviteModal";
import { useRouter } from "next/navigation";
import styles from "./TetrisGame.module.css";
import Image from "next/image";
const TetrisGame: React.FC = () => {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [score, setScore] = useState(0);
  const [gameController, setGameController] = useState<any>(null);
  const [showRules, setShowRules] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const router = useRouter();
  const scoreRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (scoreRef.current) {
      scoreRef.current.textContent = String(score);
    }
  }, [score]);

  const handleBack = () => {
    router.push("/");
  };

  const handleTryAgain = (controller: any) => {
    if (likes > 0) {
      setLikes((prev) => prev - 1);
      controller.restart();
    }
  };

  const handleShareForLives = () => {
    setLikes((prev) => prev + 3);
    if (gameController) {
      gameController.restart();
    }
  };

  const handleInviteFriend = () => {
    setShowInviteModal(true);
  };
  
  const handleSendInvite = () => {
    setShowInviteModal(false);
  };

  return (
    <div className="max-w-md w-full">
      <div className="bg-[#0F2A4A] text-white rounded-lg overflow-hidden shadow-xl">
        {/* Header */}
        <div className="p-4 pb-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex justify-between">
                <div className="text-[#5CB2D1] flex gap-1 text-2xl font-bold">
                  <Image
                    src="/images/logo/logo-mini.png"
                    alt="logo"
                    width={168}
                    height={168}
                    className="w-[186px] h-[30px] object-contain"
                  />
                  <span className="text-[#CBF1FF] flex  justify-end flex-col ml-1">
                    Tetris
                  </span>
                </div>
                <button onClick={handleBack} className="text-white p-1">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14 26L4 16L14 6"
                      stroke="#E6E6E6"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M28 16L4 16"
                      stroke="#E6E6E6"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex justify-between">
                <p className="text-xl font-normal w-4/5">
                  Win up to 30% off on your Mochi Sofa by playing this game with
                  friends!
                </p>
                <button 
                  className="flex flex-col justify-end"
                  onClick={() => setShowRules(true)}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.87891 7.51884C11.0505 6.49372 12.95 6.49372 14.1215 7.51884C15.2931 8.54397 15.2931 10.206 14.1215 11.2312C13.9176 11.4096 13.6917 11.5569 13.4513 11.6733C12.7056 12.0341 12.0002 12.6716 12.0002 13.5V14.25M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM12 17.25H12.0075V17.2575H12V17.25Z"
                      stroke="#E6E6E6"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="px-4">
          {/* Tetris Game Board */}
          <div
            className="rounded-lg p-0 mb-4 overflow-hidden relative"
            style={{ height: "calc(70vh - 40px)", maxHeight: "600px" }}
          >
            <div className="flex absolute top-[1px] right-0 justify-end items-center">
              <button className="flex items-center text-white">
                <span className="mr-1">{likes}</span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill={isLiked ? "#5CB2D1" : "none"}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                    stroke={isLiked ? "#5CB2D1" : "white"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div
              className="bg-[#CBF1FF] relative top-[1px] w-[144px] text-[#0F2A4A] px-4 py-2  font-bold"
              style={{ borderRadius: "12px 12px 0px 0px" }}
            >
              Score: <span ref={scoreRef}>{score}</span>
            </div>
            <Tetris
              keyboardControls={{
                down: "MOVE_DOWN",
                left: "MOVE_LEFT",
                right: "MOVE_RIGHT",
                space: "HARD_DROP",
                z: "FLIP_COUNTERCLOCKWISE",
                x: "FLIP_CLOCKWISE",
                up: "FLIP_CLOCKWISE",
                p: "TOGGLE_PAUSE",
                c: "HOLD",
                shift: "HOLD",
              }}
            >
              {({ Gameboard, points, state, controller }) => {
                React.useEffect(() => {
                  setScore(points);
                }, [points]);

                React.useEffect(() => {
                  if (controller && controller !== gameController) {
                    setGameController(controller);
                  }
                }, [controller]);

                return (
                  <>
                    <div
                      className={`${styles.gameContainer} border-4 border-[#CBF1FF]`}
                    >
                      <Gameboard />

                      <GameOverModal
                        isOpen={state === "LOST"}
                        points={points}
                        onTryAgain={() => handleTryAgain(controller)}
                        onTakeOffer={() => alert("Take Offer")}
                        onGetDirectDiscount={() => alert("Get Direct Discount")}
                        hasLives={likes > 0}
                        onShareForLives={handleShareForLives}
                      />
                    </div>

                    {/* Game Controls */}
                    <div className="flex justify-between mb-4 mt-2.5">
                      <button
                        className="bg-[#5CB2D1] p-3 w-11 h-11 flex justify-center items-center rounded-md"
                        onClick={() => controller.moveRight()}
                      >
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M18 6L28 16L18 26"
                            stroke="white"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M4 16L28 16"
                            stroke="white"
                            strokeWidth="4"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                      <button
                        className="bg-[#5CB2D1] p-3 w-11 h-11 flex justify-center items-center rounded-md"
                        onClick={() => controller.moveLeft()}
                      >
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14 26L4 16L14 6"
                            stroke="white"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M28 16L4 16"
                            stroke="white"
                            strokeWidth="4"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                      <button
                        className="bg-[#5CB2D1] p-3 w-11 h-11 flex justify-center items-center rounded-md"
                        onClick={() => controller.hardDrop()}
                      >
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M26 18L16 28L6 18"
                            stroke="white"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M16 4L16 28"
                            stroke="white"
                            strokeWidth="4"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                      <button
                        className="bg-[#5CB2D1] p-3 w-11 h-11 flex justify-center items-center rounded-md"
                        onClick={() => controller.flipCounterclockwise()}
                      >
                        <svg
                          width="41"
                          height="19"
                          viewBox="0 0 41 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.93235 15.4849C6.10192 7.38792 14.4246 2.58284 22.5215 4.75241C27.0673 5.97045 30.5152 9.11388 32.3035 13.0984L29.3946 12.3098C28.3285 12.0208 27.23 12.6508 26.941 13.7169C26.652 14.783 27.2819 15.8815 28.348 16.1705L34.6888 17.8894C34.7595 17.913 34.8318 17.9326 34.9053 17.9481L35.7167 18.1681C36.2297 18.3071 36.7768 18.2363 37.2375 17.9713C37.6981 17.7062 38.0343 17.2687 38.1719 16.7554L40.1479 9.38089C40.4337 8.31396 39.8006 7.21729 38.7336 6.9314C37.6667 6.64552 36.57 7.27869 36.2842 8.34562L35.6313 10.7822C33.297 6.07959 29.0717 2.36642 23.5568 0.888702C13.326 -1.85263 2.80998 4.21878 0.0686448 14.4496C-0.217239 15.5165 0.415926 16.6132 1.48286 16.8991C2.54979 17.185 3.64646 16.5518 3.93235 15.4849Z"
                            fill="white"
                          />
                        </svg>
                      </button>
                      <button
                        className="bg-[#5CB2D1] p-3 w-11 h-11 flex justify-center items-center rounded-md"
                        onClick={() => controller.flipClockwise()}
                      >
                        <svg
                          width="41"
                          height="19"
                          viewBox="0 0 41 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M36.2842 15.4849C34.1146 7.38792 25.7919 2.58284 17.695 4.75241C13.1492 5.97045 9.70135 9.11388 7.91305 13.0984L10.8219 12.3098C11.888 12.0208 12.9865 12.6508 13.2755 13.7169C13.5645 14.783 12.9346 15.8815 11.8685 16.1705L5.52774 17.8894C5.45699 17.9129 5.3847 17.9326 5.31119 17.9481L4.49978 18.1681C3.98685 18.3071 3.43966 18.2363 2.97902 17.9713C2.51839 17.7062 2.18218 17.2687 2.04463 16.7554L0.0686445 9.38089C-0.217239 8.31396 0.415926 7.21729 1.48286 6.9314C2.54979 6.64552 3.64647 7.27869 3.93235 8.34562L4.58523 10.7822C6.91948 6.07959 11.1448 2.36642 16.6597 0.888702C26.8905 -1.85263 37.4065 4.21878 40.1479 14.4496C40.4337 15.5165 39.8006 16.6132 38.7336 16.8991C37.6667 17.185 36.57 16.5518 36.2842 15.4849Z"
                            fill="white"
                          />
                        </svg>
                      </button>
                    </div>
                  </>
                );
              }}
            </Tetris>
          </div>

          {/* Invite Button */}
          <button
            onClick={handleInviteFriend}
            className="w-full bg-[#5CB2D1] text-white py-3 px-4 rounded-md flex items-center justify-center mb-4"
          >
            <svg
              className="mr-2"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 15.5V17.5C15 18.0523 14.5523 18.5 14 18.5H3C2.44772 18.5 2 18.0523 2 17.5V6.5C2 5.94772 2.44772 5.5 3 5.5H5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 12.5L18 2.5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13 2.5H18V7.5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Invite your friend for more discount
          </button>
        </div>
      </div>

      <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />
      
      <InviteModal 
        isOpen={showInviteModal} 
        onClose={() => setShowInviteModal(false)} 
        onSendInvite={handleSendInvite} 
      />
    </div>
  );
};

export default TetrisGame;
