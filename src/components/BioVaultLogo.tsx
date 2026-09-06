import React from 'react';

// Tree-Ring Cross Section Logo — detailed realistic SVG (transparent bg)
export const TreeRingLogo: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Outer bark ring — dark rough edge */}
    <circle cx="50" cy="50" r="48" fill="#3B2410" />
    {/* Bark texture ring */}
    <circle cx="50" cy="50" r="44" fill="#5C3518" />
    {/* Sapwood rings — alternating dark/light */}
    <circle cx="50" cy="50" r="41" fill="#C49A6C" />
    <circle cx="50" cy="50" r="38" fill="#3B2410" />
    <circle cx="50" cy="50" r="35.5" fill="#D4AA7A" />
    <circle cx="50" cy="50" r="33" fill="#4A2C14" />
    <circle cx="50" cy="50" r="30.5" fill="#C8956A" />
    <circle cx="50" cy="50" r="28" fill="#3B2410" />
    <circle cx="50" cy="50" r="25.5" fill="#DEB882" />
    <circle cx="50" cy="50" r="23" fill="#4A2C14" />
    <circle cx="50" cy="50" r="20.5" fill="#C8956A" />
    <circle cx="50" cy="50" r="18" fill="#3B2410" />
    <circle cx="50" cy="50" r="15.5" fill="#D4AA7A" />
    <circle cx="50" cy="50" r="13" fill="#4A2C14" />
    <circle cx="50" cy="50" r="10.5" fill="#C49A6C" />
    <circle cx="50" cy="50" r="8"   fill="#3B2410" />
    {/* Heartwood center */}
    <circle cx="50" cy="50" r="5.5" fill="#C8956A" />
    <circle cx="50" cy="50" r="3"   fill="#5C3518" />
    {/* Subtle radial grain lines */}
    <line x1="50" y1="4"  x2="50" y2="96" stroke="#2B1A0A" strokeWidth="0.4" opacity="0.25"/>
    <line x1="4"  y1="50" x2="96" y2="50" stroke="#2B1A0A" strokeWidth="0.4" opacity="0.25"/>
    <line x1="16" y1="16" x2="84" y2="84" stroke="#2B1A0A" strokeWidth="0.4" opacity="0.2"/>
    <line x1="84" y1="16" x2="16" y2="84" stroke="#2B1A0A" strokeWidth="0.4" opacity="0.2"/>
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
    <circle cx="70" cy="70" r="54" fill="#E8DEC9" opacity="0.65" />
    <rect x="28" y="24" width="66" height="88" rx="6" fill="#FAF6EE" stroke="#434225" strokeWidth="3.5" />
    <line x1="38" y1="24" x2="38" y2="112" stroke="#434225" strokeWidth="2.5" opacity="0.7" />
    <line x1="46" y1="46" x2="82" y2="46" stroke="#434225" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
    <line x1="46" y1="58" x2="72" y2="58" stroke="#434225" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
    <rect x="74" y="70" width="40" height="34" rx="6" fill="#FAF6EE" stroke="#434225" strokeWidth="3.5" />
    <path d="M83 70 V58 A11 11 0 0 1 105 58 V70" stroke="#434225" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    <circle cx="94" cy="83" r="3.5" fill="#434225" />
    <path d="M94 86.5 V93" stroke="#434225" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// Tab Icon 1: Open Book Icon (Journal Vault)
export const OpenBookIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="#434225" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2 4h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 4h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

// Tab Icon 2: Squiggly Wave + Baseline (Mood Spectrum) — matches user reference
export const BarChartIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#434225"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Squiggly tilde wave */}
    <path d="M2 10 C3.5 7, 5.5 7, 7 10 C8.5 13, 10.5 13, 12 10 C13.5 7, 15.5 7, 17 10 C18.5 13, 20.5 13, 22 10" />
    {/* Flat baseline below */}
    <line x1="2" y1="15" x2="22" y2="15" />
  </svg>
);

// Tab Icon 3: Double Sparkle Star Icon (AI Insights)
export const SparkleDoubleIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M13 3C13 7.4 9.4 11 5 11C9.4 11 13 14.6 13 19C13 14.6 16.6 11 21 11C16.6 11 13 7.4 13 3Z" stroke="#434225" strokeWidth="2" fill="none" />
    <path d="M6 3C6 4.3 4.7 5.5 3 5.5C4.7 5.5 6 6.7 6 8C6 6.7 7.3 5.5 9 5.5C7.3 5.5 6 4.3 6 3Z" fill="#434225" />
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
