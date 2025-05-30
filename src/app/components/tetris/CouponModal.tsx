import React from "react";

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  couponCode?: string;
  handleSendInvite: () => void;
}

const CouponModal: React.FC<CouponModalProps> = ({ isOpen, onClose, couponCode = "NSODY29SY", handleSendInvite }) => {
  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(couponCode);
  };

  const goToAroomyMall = () => {
    window.open("https://mall.aroomy.com", "_blank");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="bg-white w-[320px] rounded-xl p-6 max-w-md relative z-10 flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="text-center mb-6 w-full">
          <h2 className="text-[#1A305B] text-4xl font-extrabold mb-4">Promo Code</h2>
          <p className="text-xl font-bold">Your code will be show once friend play this game</p>
        </div>

        <div className="bg-[#E6E6E6] rounded-md p-4 mb-6 w-full flex items-center justify-center gap-6">
          <span className={`text-2xl ${couponCode ? "text-[#000000]" : "text-[#1A305B]"} font-bold`}>{couponCode || "Not available yet"}</span>
          {couponCode && <button
            onClick={handleCopyCode}
            className="bg-[#5CB2D1] h-[24px] flex justify-center items-center text-[#1A305B] font-bold px-4 py-2 rounded-md hover:bg-[#4a9ab8] transition-colors"
          >
            Copy
          </button>}
        </div>

        <p className="text-center text-sm mb-6 w-full">
          *This coupon will be activate<br />
          when your friend play this game
        </p>

        <button
          onClick={couponCode ? goToAroomyMall : handleSendInvite}
          className="bg-[#5CB2D1] text-white font-bold py-3 px-6 rounded-md flex items-center gap-2 justify-center w-full"
        >
          {couponCode ? <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M10 21C10.8284 21 11.5 20.3284 11.5 19.5C11.5 18.6716 10.8284 18 10 18C9.17157 18 8.5 18.6716 8.5 19.5C8.5 20.3284 9.17157 21 10 21Z" fill="white" />
            <path fillRule="evenodd" clipRule="evenodd" d="M18 21C18.8284 21 19.5 20.3284 19.5 19.5C19.5 18.6716 18.8284 18 18 18C17.1716 18 16.5 18.6716 16.5 19.5C16.5 20.3284 17.1716 21 18 21Z" fill="white" />
            <path d="M3.5 3C2.94772 3 2.5 3.44772 2.5 4C2.5 4.55228 2.94772 5 3.5 5H3.93845C4.39731 5 4.7973 5.3123 4.90859 5.75746L7.15112 14.7276C7.485 16.0631 8.68495 17 10.0616 17H17.8957C19.3018 17 20.5192 16.0234 20.8242 14.6508L21.9353 9.65079C22.3517 7.77725 20.926 6 19.0068 6H7.03078L6.84888 5.27239C6.515 3.93689 5.31505 3 3.93845 3H3.5Z" fill="white" />
          </svg> : <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 6H5.75C4.50736 6 3.5 7.00736 3.5 8.25V18.75C3.5 19.9926 4.50736 21 5.75 21H16.25C17.4926 21 18.5 19.9926 18.5 18.75V10.5M8 16.5L21.5 3M21.5 3L16.25 3M21.5 3V8.25" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          }
          {couponCode ? "Go to Aroomy Mall" : "Send coupon to a friend "}
        </button>
      </div>
    </div>
  );
};

export default CouponModal;
