import React from 'react';

// Tree-Ring Concentric Woodgrain Logo
export const TreeRingLogo: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="50" cy="50" r="46" stroke="#434225" strokeWidth="4.5" fill="none" />
    <path d="M50 7 A43 43 0 1 1 49.9 7" stroke="#434225" strokeWidth="3" strokeDasharray="8 4" fill="none" />
    <circle cx="50" cy="50" r="35" stroke="#434225" strokeWidth="3.5" fill="none" />
    <path d="M50 19 A31 31 0 1 0 50.1 19" stroke="#434225" strokeWidth="2.5" fill="none" />
    <circle cx="50" cy="50" r="23" stroke="#434225" strokeWidth="3" fill="none" />
    <circle cx="50" cy="50" r="13" stroke="#434225" strokeWidth="2.5" fill="none" />
    <circle cx="50" cy="50" r="6" fill="#434225" />
  </svg>
);

// Detailed Vector Art: Book with Padlock attached
export const BookLockVector: React.FC<{ size?: number; className?: string }> = ({ size = 130, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 140 140" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Soft tan circle backdrop */}
    <circle cx="70" cy="70" r="54" fill="#E8DEC9" opacity="0.65" />
    
    {/* Notebook Main Body */}
    <rect x="28" y="24" width="66" height="88" rx="6" fill="#FAF6EE" stroke="#434225" strokeWidth="3.5" />
    
    {/* Notebook Spine details */}
    <line x1="38" y1="24" x2="38" y2="112" stroke="#434225" strokeWidth="2.5" opacity="0.7" />
    <line x1="46" y1="46" x2="82" y2="46" stroke="#434225" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
    <line x1="46" y1="58" x2="72" y2="58" stroke="#434225" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
    
    {/* Lock Body */}
    <rect x="74" y="70" width="40" height="34" rx="6" fill="#FAF6EE" stroke="#434225" strokeWidth="3.5" />
    
    {/* Lock Shackle */}
    <path d="M83 70 V58 A11 11 0 0 1 105 58 V70" stroke="#434225" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    
    {/* Keyhole */}
    <circle cx="94" cy="83" r="3.5" fill="#434225" />
    <path d="M94 86.5 V93" stroke="#434225" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// Sparkle Star Icon (✦)
export const SparkleStar: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
  </svg>
);
