import React from "react";
import Image from "next/image";

interface DesignScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyDiscount: () => void;
  onCheckout: () => void;
  showDiscount: boolean;
}

const DesignScoreModal: React.FC<DesignScoreModalProps> = ({
  isOpen,
  onClose,
  onApplyDiscount,
  onCheckout,
  showDiscount,
}) => {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Modal Background Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isOpen
            ? "bg-opacity-50 opacity-100"
            : "bg-opacity-0 opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="bg-white rounded-[20px] p-6 w-full max-w-md mx-4 relative z-10">
        <h2 className="text-center text-3xl font-bold text-[#1A305B] mb-2.5">
          Design Score
        </h2>

        {/* Star Rating */}
        <div className="flex justify-center mb-3">
          {[1, 2, 3, 4, 5].map((star, index) => (
            <div key={index} className="w-10 h-10 mx-1">
              {index < 4 ? (
                <svg
                  width="44"
                  height="42"
                  viewBox="0 0 44 42"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.9775 3.72754C19.9782 1.16973 23.9374 1.25525 25.8076 3.9834L30.1016 10.249L30.1855 10.3604C30.3909 10.6108 30.6678 10.7945 30.9805 10.8867L38.2656 13.0342L38.5664 13.1338C41.5192 14.21 42.6846 17.7959 40.9287 20.4023L40.7432 20.6602L36.1113 26.6797C35.8842 26.975 35.7662 27.3395 35.7764 27.7119L35.9844 35.3047L35.9834 35.6211C35.8724 38.7623 32.8216 40.9794 29.7998 40.1143L29.498 40.0176L22.3418 37.4727C22.0347 37.3635 21.703 37.3497 21.3896 37.4316L21.2568 37.4727L14.1006 40.0176C10.8833 41.1617 7.51956 38.718 7.61328 35.3047L7.82227 27.7119L7.82031 27.5732C7.80417 27.2961 7.71707 27.0277 7.56738 26.7939L7.4873 26.6797L2.85547 20.6602C0.773139 17.9538 2.05761 13.9997 5.33301 13.0342L12.6182 10.8867L12.75 10.8418C13.0516 10.7239 13.3118 10.5178 13.4961 10.249L17.79 3.9834L17.9775 3.72754Z"
                    fill="#F8CE37"
                    stroke="#C68A09"
                    strokeWidth="3.24"
                  />
                </svg>
              ) : (
                <svg
                  width="44"
                  height="42"
                  viewBox="0 0 44 42"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.5791 3.72754C20.5797 1.16973 24.539 1.25525 26.4092 3.9834L30.7031 10.249L30.7871 10.3604C30.9925 10.6108 31.2693 10.7945 31.582 10.8867L38.8672 13.0342L39.168 13.1338C42.1208 14.21 43.2861 17.7959 41.5303 20.4023L41.3447 20.6602L36.7129 26.6797C36.4857 26.975 36.3677 27.3395 36.3779 27.7119L36.5859 35.3047L36.585 35.6211C36.474 38.7623 33.4231 40.9794 30.4014 40.1143L30.0996 40.0176L22.9434 37.4727C22.6362 37.3635 22.3045 37.3497 21.9912 37.4316L21.8584 37.4727L14.7021 40.0176C11.4848 41.1617 8.12112 38.718 8.21484 35.3047L8.42383 27.7119L8.42188 27.5732C8.40573 27.2961 8.31863 27.0277 8.16895 26.7939L8.08887 26.6797L3.45703 20.6602C1.3747 17.9538 2.65918 13.9997 5.93457 13.0342L13.2197 10.8867L13.3516 10.8418C13.6531 10.7239 13.9134 10.5178 14.0977 10.249L18.3916 3.9834L18.5791 3.72754Z"
                    fill="#E6E6E6"
                    stroke="#C68A09"
                    strokeWidth="3.24"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-sm font-semibold mb-2.5">
          Nice work! Your Mochi Sofa
          <br />
          ranks higher than 95% of designs!
        </p>

        {/* Trophy Image */}
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32">
            <Image
              src="/images/furniture/trophy.png"
              alt="Trophy"
              width={128}
              height={128}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Buttons */}
        <button
          onClick={onApplyDiscount}
          className={`w-full px-3 h-[56px] bg-[#CBF1FF] text-[#333A3F] font-extrabold text-base rounded-md transition-all duration-300 mb-3 relative overflow-hidden ${
            showDiscount ? "py-1" : "py-3"
          }`}
        >
          {!showDiscount ? (
            <span className="transition-opacity duration-300">
              Apply Bonus Discount
            </span>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div className="text-[#1A305B] font-bold text-base">
                You win <span className="text-[#FF6F50] text-xl">33%off</span>
              </div>
              <div className="flex flex-col items-end ml-4">
                <span className="text-[#5CB2D1] text-2xl font-extrabold">
                  $200
                </span>
                <span className="text-gray-400 text-xs line-through">$300</span>
              </div>
            </div>
          )}
        </button>

        <button
          onClick={onCheckout}
          className="w-full py-3 px-4 bg-[#5CB2D1] text-white font-extrabold rounded-md transition duration-200 mb-3"
        >
          Check Out
        </button>

        <p className="text-center text-base font-bold">
          Play <span className="text-[#5CB2D1]">game</span> to get more discounts
        </p>
      </div>
    </div>
  );
};

export default DesignScoreModal;
