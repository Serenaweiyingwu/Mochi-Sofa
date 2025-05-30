import React, { useState } from "react";
import Image from "next/image";
interface GameOverModalProps {
  isOpen: boolean;
  points: number;
  onClose: () => void;
  onTryAgain: () => void;
  onTakeOffer: () => void;
  onGetDirectDiscount: () => void;
  hasLives?: boolean;
  onShareForLives?: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  points,
  onClose,
  onTryAgain,
  onTakeOffer,
  onGetDirectDiscount,
  hasLives = true,
  onShareForLives,
}) => {
  const [showLifeModal, setShowLifeModal] = useState(false);

  const handleTryAgain = () => {
    if (hasLives) {
      onTryAgain();
    } else {
      setShowLifeModal(true);
    }
  };
  const calculateDiscount = (score: number): number => {
    if (score >= 10000) return 30;
    if (score >= 5000) return 5;
    if (score >= 4000) return 3;
    if (score >= 3000) return 2;
    if (score >= 2000) return 1;
    return 0;
  };

  const getCouponImage = (score: number): string => {
    if (score >= 10000) return "/images/furniture/Coupon30.png";
    if (score >= 5000) return "/images/furniture/Coupon5.png";
    if (score >= 4000) return "/images/furniture/Coupon3.png";
    if (score >= 3000) return "/images/furniture/Coupon2.png";
    if (score >= 2000) return "/images/furniture/Coupon1.png";
    return "/images/furniture/Coupon0.png";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 transition-all duration-300">
      <div
        onClick={() => {onClose();handleTryAgain();}}
        className="fixed inset-0 bg-[#1A305B99] transition-opacity duration-300"
      />


      {showLifeModal ? (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowLifeModal(false)}></div>
          <div className="bg-white rounded-xl p-6 max-w-xs w-full relative z-10 flex flex-col items-center">
            <button
              onClick={() => setShowLifeModal(false)}
              className="absolute right-4 top-4 text-gray-500"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <h2 className="text-[#FF6B6B] text-3xl font-bold mb-2">You have 0 life</h2>
            <p className="text-center text-black font-semibold mb-6">Share this game to get<br />3 more chances</p>

            <div className="mb-6">
              <Image
                src="/images/furniture/nolife.png"
                alt="No life"
                width={168}
                height={168}
                className="w-[168px] h-[168px] object-contain"
              />

            </div>

            <button
              onClick={() => {
                setShowLifeModal(false);
                if (onShareForLives) onShareForLives();
              }}
              className="bg-[#CBF1FF] text-[#333A3F] font-extrabold py-3 px-6 rounded-full flex items-center justify-center w-full"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 6H5.25C4.00736 6 3 7.00736 3 8.25V18.75C3 19.9926 4.00736 21 5.25 21H15.75C16.9926 21 18 19.9926 18 18.75V10.5M7.5 16.5L21 3M21 3L15.75 3M21 3V8.25" stroke="#333A3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="ml-0.5">
                Share to earn 3 lives

              </span>
            </button>
          </div>
        </div>
      ) : <div className="bg-white rounded-[20px] p-6 w-full max-w-md mx-4 relative z-10">
        {calculateDiscount(points) > 0 && <div className="absolute inset-0 z-0 rounded-[20px] overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 20 + 5}px`,
                backgroundColor: [
                  '#FF6B6B', '#4ECDC4', '#FFD166',
                  '#6A0572', '#AB83A1', '#FC9D9D'
                ][Math.floor(Math.random() * 6)],
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>}

        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-[#1e3a57] mb-4 text-center">Game over</h2>

          {calculateDiscount(points) > 0 ? (
            <h3 className="text-xl text-black font-bold mb-6 text-center">
              Congratulation, You get<br />
              <span className="font-bold">{calculateDiscount(points)}% off Coupon!</span>
            </h3>
          ) : (
            <h3 className="text-xl font-bold mb-2.5 text-black text-center">
              Don’t give up, you are<br />
              almost there!
            </h3>
          )}
          <div className="text-center text-black font-normal text-2xl mb-6">
            Score: {points}
          </div>
          <div className="flex justify-center mb-6">
            <Image
              src={getCouponImage(points)}
              alt={`${calculateDiscount(points)}% discount`}
              width={168}
              height={168}
              className="w-[168px] h-[168px] object-contain"
            />
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={handleTryAgain}
              className="bg-[#CBF1FF] text-[#333A3F] font-extrabold p-3 rounded-lg flex gap-1 items-center justify-center w-[45%]"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.023 9.34841H21.0156V9.34663M2.98438 19.6444V14.6517M2.98438 14.6517L7.97702 14.6517M2.98438 14.6517L6.16527 17.8347C7.15579 18.8271 8.41285 19.58 9.8646 19.969C14.2657 21.1483 18.7895 18.5364 19.9687 14.1353M4.03097 9.86484C5.21024 5.46374 9.73402 2.85194 14.1351 4.03121C15.5869 4.4202 16.8439 5.17312 17.8345 6.1655L21.0156 9.34663M21.0156 4.3558V9.34663" stroke="#333A3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              Try again
            </button>

            <button
              onClick={onTakeOffer}
              className="bg-[#1A305B] text-base text-white font-extrabold p-3 rounded-lg flex gap-1 items-center justify-center w-[45%]"
            >
              Take the offer
            </button>
          </div>

          <button
            onClick={onGetDirectDiscount}
            className="w-full font-extrabold text-base mt-4 bg-[#5CB2D1] text-white py-3 rounded-lg"
          >
            Get 5% OFF Directly
          </button>

          <p className="text-sm font-bold mt-4 text-center">
            <span className="text-gray-600">get</span> <span className="text-[#FF6B6B] font-bold">5% off</span> <span className="text-gray-600">by invite your friend</span>
          </p>
        </div>
      </div>}
    </div>
  );
};

export default GameOverModal;
