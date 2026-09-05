import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { JournalChat } from './components/JournalChat';
import { JournalHistory } from './components/JournalHistory';
import { MoodAnalytics } from './components/MoodAnalytics';
import { InsightEngine } from './components/InsightEngine';
import { AuthModal } from './components/AuthModal';
import { SecurityAuditModal } from './components/SecurityAuditModal';
import { ExportModal } from './components/ExportModal';
import { VoiceJournaler } from './components/VoiceJournaler';
import './index.css';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('chat');
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  
  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState<boolean>(false);
  const [voiceText, setVoiceText] = useState<string>('');

  const handleEntrySaved = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSelectPrompt = (promptText: string) => {
    setVoiceText(promptText);
    setActiveTab('chat');
  };

  return (
    <div className="app-layout">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAuthModal={() => setIsAuthOpen(true)}
        openSecurityModal={() => setIsSecurityOpen(true)}
        openExportModal={() => setIsExportOpen(true)}
      />

      <main className="app-main-content">
        {activeTab === 'chat' && (
          <JournalChat
            onEntrySaved={handleEntrySaved}
            openVoiceModal={() => setIsVoiceOpen(true)}
            openExportModal={() => setIsExportOpen(true)}
            recordedVoiceText={voiceText}
            clearVoiceText={() => setVoiceText('')}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === 'history' && (
          <JournalHistory refreshTrigger={refreshTrigger} />
        )}
        {activeTab === 'analytics' && (
          <MoodAnalytics />
        )}
        {activeTab === 'insights' && (
          <InsightEngine onSelectPrompt={handleSelectPrompt} />
        )}
      </main>

      {/* Global Modals */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <SecurityAuditModal isOpen={isSecurityOpen} onClose={() => setIsSecurityOpen(false)} />
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
      <VoiceJournaler
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onTranscriptComplete={(text) => setVoiceText(text)}
      />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
