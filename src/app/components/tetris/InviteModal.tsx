import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useInviteMutation } from "@/api/aroomy-api";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  inviterId?: string;
}

const InviteModal: React.FC<InviteModalProps> = ({ isOpen, onClose, inviterId }) => {
  const [inviteCode, setInviteCode] = useState("");
  const [invite] = useInviteMutation();
  
  useEffect(() => {
    if (isOpen && inviterId) {
      setInviteCode(inviterId);
    }
  }, [isOpen, inviterId]);
  
  const getInviteUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/tetris?invite=${inviteCode}`;
  };
  
  const copyInviteLink = () => {
    invite({ inviteV1Request: { user_id: inviteCode } })
    navigator.clipboard.writeText(getInviteUrl())
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-xl p-6 max-w-xs w-full relative z-10 flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <h2 className="text-[#1A305B] text-3xl font-bold mb-1 text-center">5% off for both</h2>
        <p className="text-center font-bold mb-4">
          Invite a friend and get<br />
          5% off for both of you
        </p>

        <div className="mb-4">
          <Image
            src="/images/furniture/coupon5.png"
            alt="5% discount"
            width={168}
            height={100}
            className="w-[168px] h-[100px] object-contain"
          />
        </div>
        <p className="text-center text-sm mb-4">
        *This coupon will send to you<br />
        when your friend play this game
        </p>

        <button
          onClick={copyInviteLink}
          className="bg-[#5CB2D1] text-white font-bold py-3 px-6 rounded-md flex items-center gap-1 justify-center w-full"
        >
          <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 6H5.75C4.50736 6 3.5 7.00736 3.5 8.25V18.75C3.5 19.9926 4.50736 21 5.75 21H16.25C17.4926 21 18.5 19.9926 18.5 18.75V10.5M8 16.5L21.5 3M21.5 3L16.25 3M21.5 3V8.25" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          Send coupon to a friend
        </button>
      </div>
    </div>
  );
};

export default InviteModal;
