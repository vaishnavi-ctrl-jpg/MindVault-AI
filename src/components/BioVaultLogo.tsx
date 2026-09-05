import React from 'react';

export const TreeRingLogo: React.FC<{ size?: number; className?: string }> = ({ size = 42, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="50" cy="50" r="46" stroke="#434225" strokeWidth="4" opacity="0.95" />
    <path d="M50 8 A42 42 0 1 1 49.9 8" stroke="#434225" strokeWidth="3" strokeDasharray="6 3" />
    <circle cx="50" cy="50" r="35" stroke="#434225" strokeWidth="3.5" opacity="0.85" />
    <path d="M50 20 A30 30 0 1 0 50.1 20" stroke="#434225" strokeWidth="2.5" />
    <circle cx="50" cy="50" r="23" stroke="#434225" strokeWidth="3" opacity="0.75" />
    <circle cx="50" cy="50" r="14" stroke="#434225" strokeWidth="2.5" opacity="0.65" />
    <circle cx="50" cy="50" r="6" fill="#434225" />
  </svg>
);

export const BookLockVector: React.FC<{ size?: number; className?: string }> = ({ size = 120, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 140 140" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Soft background glow circle */}
    <circle cx="70" cy="70" r="55" fill="#E5D5C0" opacity="0.6" />
    
    {/* Book Outline */}
    <rect x="30" y="25" width="65" height="85" rx="5" fill="#FAF6EE" stroke="#434225" strokeWidth="3.5" />
    <path d="M30 35 H95" stroke="#434225" strokeWidth="2" opacity="0.5" />
    <line x1="42" y1="48" x2="80" y2="48" stroke="#434225" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
    <line x1="42" y1="60" x2="70" y2="60" stroke="#434225" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
    
    {/* Padlock Overlay */}
    <rect x="75" y="70" width="38" height="32" rx="6" fill="#FAF6EE" stroke="#434225" strokeWidth="3.5" />
    <path d="M84 70 V60 A10 10 0 0 1 104 60 V70" stroke="#434225" strokeWidth="3.5" strokeLinecap="round" />
    <circle cx="94" cy="83" r="3" fill="#434225" />
    <path d="M94 86 V92" stroke="#434225" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);
