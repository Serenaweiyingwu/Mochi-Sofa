import React from "react";

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-xl p-6 max-w-xs w-full relative z-10">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <h2 className="text-[#1A305B] text-2xl font-bold mb-4 text-center">Tetris Prize</h2>
        
        <div className="rounded-lg overflow-hidden mb-4 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-0 text-left">
            <div className="font-bold text-left text-lg py-2 px-4">Prize</div>
            <div className="font-bold text-right text-lg py-2 px-4">Score</div>
          </div>
          
          <div className="grid grid-cols-2 gap-0 text-left">
            <div className="py-2 px-4">No Discount</div>
            <div className="py-2 px-4 text-right">Below 2000</div>
          </div>
          
          <div className="grid grid-cols-2 gap-0 text-left bg-[#E8F5FA]">
            <div className="py-2 px-4">1 % off</div>
            <div className="py-2 px-4 text-right">2000-2999</div>
          </div>
          
          <div className="grid grid-cols-2 gap-0 text-left bg-[#E8F5FA]">
            <div className="py-2 px-4">2 % off</div>
            <div className="py-2 px-4 text-right">3000-3999</div>
          </div>
          
          <div className="grid grid-cols-2 gap-0 text-left bg-[#E8F5FA]">
            <div className="py-2 px-4">3 % off</div>
            <div className="py-2 px-4 text-right">4000-4999</div>
          </div>
          
          <div className="grid grid-cols-2 gap-0 text-left bg-[#E8F5FA]">
            <div className="py-2 px-4">5 % off</div>
            <div className="py-2 px-4 text-right">5000-9999</div>
          </div>
          
          <div className="grid grid-cols-2 gap-0 text-left bg-[#E8F5FA]">
            <div className="py-2 px-4">30 % off</div>
            <div className="py-2 px-4 text-right">10000</div>
          </div>
        </div>
        
        <p className="text-center font-bold text-sm">
          Or get <span className="text-[#FF6F50]">5% off</span> directly to buy with your friend together.
        </p>
      </div>
    </div>
  );
};

export default RulesModal;
