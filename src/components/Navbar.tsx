import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  MessageSquare, 
  BookOpen, 
  BarChart3, 
  Sparkles, 
  Lock, 
  LogOut, 
  User, 
  Key,
  Database
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAuthModal: () => void;
  openSecurityModal: () => void;
  openExportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openAuthModal,
  openSecurityModal,
  openExportModal
}) => {
  const { user, signOut } = useAuth();

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand Header */}
        <div className="brand-section" onClick={() => setActiveTab('chat')}>
          <div className="logo-icon-glow">
            <Sparkles className="logo-icon" />
          </div>
          <div>
            <div className="brand-title-wrap">
              <span className="brand-title">MindVault</span>
              <span className="brand-accent">AI</span>
              <span className="badge-ideathon">Ideathon Project</span>
            </div>
            <p className="brand-subtitle">Secure Gemini Personal Journal & Cognitive Analytics</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-tabs">
          <button 
            className={`nav-tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <MessageSquare className="tab-icon" />
            <span>AI Journal</span>
          </button>
          <button 
            className={`nav-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <BookOpen className="tab-icon" />
            <span>Journal Vault</span>
          </button>
          <button 
            className={`nav-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 className="tab-icon" />
            <span>Mood Spectrum</span>
          </button>
          <button 
            className={`nav-tab-btn ${activeTab === 'insights' ? 'active' : ''}`}
            onClick={() => setActiveTab('insights')}
          >
            <Sparkles className="tab-icon" />
            <span>AI Insights</span>
          </button>
        </nav>

        {/* Security & User Controls */}
        <div className="header-actions">
          {/* Security Status Badge */}
          <button 
            className="security-pill" 
            onClick={openSecurityModal}
            title="View AI Studio Security Constitution & Verification Status"
          >
            <ShieldCheck className="shield-icon" />
            <span className="security-pill-text">GCP Secret Manager Active</span>
          </button>

          {/* Export Vault Button */}
          <button 
            className="btn-export-vault"
            onClick={openExportModal}
            title="Encrypted Vault Export (AES-256)"
          >
            <Lock className="export-icon" />
            <span>Export</span>
          </button>

          {/* User Account Controls */}
          {user ? (
            <div className="user-profile-bar">
              <div className="user-avatar-wrap">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className="user-avatar" />
                ) : (
                  <div className="user-avatar-fallback">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div className="user-info-dropdown">
                  <span className="user-name">{user.displayName}</span>
                  <span className="user-email">{user.email}</span>
                  <span className="user-isolation-tag">
                    <Database className="nano-icon" /> User ID: {user.uid.substring(0, 8)}... (Isolated)
                  </span>
                  <button className="btn-logout" onClick={signOut}>
                    <LogOut className="nano-icon" /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button className="btn-primary-auth" onClick={openAuthModal}>
              <User className="auth-btn-icon" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
