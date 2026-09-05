import React from 'react';
import { useAuth } from '../context/AuthContext';
import { TreeRingLogo } from './BioVaultLogo';
import { Upload, Key, LogOut } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAuthModal: () => void;
  openSecurityModal: () => void;
  openExportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  openAuthModal,
  openSecurityModal,
  openExportModal
}) => {
  const { user, signOut } = useAuth();

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand Header */}
        <div className="brand-section" onClick={openSecurityModal}>
          <TreeRingLogo size={46} />
          <div>
            <h1 className="brand-title">BioVault</h1>
            <p className="brand-subtitle">Secure Personal Journal & Knowledge Database</p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="header-actions">
          {/* Active Ledger Status Pill */}
          <button 
            className="status-pill-ledger" 
            onClick={openSecurityModal}
            title="View Security Audit & Database Isolation Status"
          >
            <span className="dot-ledger"></span>
            <span>Active Ledger</span>
          </button>

          {/* Export Vault Button */}
          <button 
            className="btn-brass-pill"
            onClick={openExportModal}
            title="Encrypted Vault Export (AES-256 GCM)"
          >
            <Upload className="nano-icon" />
            <span>Export</span>
          </button>

          {/* User Access Controls */}
          {user ? (
            <div className="user-profile-bar">
              <div className="user-avatar-wrap">
                <div className="user-avatar-fallback">
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
                <div className="user-info-dropdown">
                  <span className="user-name">{user.displayName}</span>
                  <span className="user-email">{user.email}</span>
                  <button className="btn-logout" onClick={signOut}>
                    <LogOut className="nano-icon" /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button className="btn-brass-pill" onClick={openAuthModal}>
              <Key className="nano-icon" />
              <span>Access</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
