import React from 'react';
import { Button } from 'antd';

interface ContinueButtonProps {
  onClick: () => void;
  loading?: boolean;
  children: React.ReactNode;
}

const ContinueButton: React.FC<ContinueButtonProps> = ({ 
  children, 
  onClick, 
  loading = false 
}) => {
  return (
    <Button
      type="primary"
      size="large"
      className="mt-6 w-full bg-[#5CB2D1] hover:bg-[#4A9BB8] text-white"
      onClick={onClick}
      loading={loading}
    >
      {children}
    </Button>
  );
};

export default ContinueButton;
