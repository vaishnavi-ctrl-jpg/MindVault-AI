import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChatMessage, JournalEntry } from '../types';
import { sendChatMessage, generateEntrySummary } from '../services/api';
import { saveUserJournal } from '../services/firestore';
import { BookLockVector, SparkleStar } from './BioVaultLogo';
import DOMPurify from 'dompurify';
import confetti from 'canvas-confetti';
import { 
  Mic, 
  Check, 
  RotateCcw, 
  BookOpen, 
  BarChart3, 
  Sparkles, 
  Lock,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

interface JournalChatProps {
  onEntrySaved: () => void;
  openVoiceModal: () => void;
  openExportModal: () => void;
  recordedVoiceText?: string;
  clearVoiceText?: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const JournalChat: React.FC<JournalChatProps> = ({ 
  onEntrySaved, 
  openVoiceModal, 
  openExportModal,
  recordedVoiceText,
  clearVoiceText,
  activeTab,
  setActiveTab
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'model',
      text: `Hello! Welcome to your local **BioVault** archive. Your confidential notes and records in this private space for your own review and goal tracking.\n\nAll entries are secured in personal database isolation and local GCM-256 key-based protection. What will you archive or review today?`,
      timestamp: 'Dec 15, 2023 | 04:03 PM'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (recordedVoiceText) {
      const sanitizedVoice = DOMPurify.sanitize(recordedVoiceText);
      setInputText(prev => (prev ? prev + ' ' + sanitizedVoice : sanitizedVoice));
      if (clearVoiceText) clearVoiceText();
    }
  }, [recordedVoiceText]);

  const handleSend = async (textToSend?: string) => {
    const rawText = textToSend || inputText;
    if (!rawText.trim() || isTyping) return;

    const sanitizedText = DOMPurify.sanitize(rawText.trim());

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      text: sanitizedText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const rawReply = await sendChatMessage(messages, sanitizedText, 'Empathetic Reflector', user?.uid);
      const sanitizedReply = DOMPurify.sanitize(rawReply);

      const aiMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        role: 'model',
        text: sanitizedReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSummarizeAndSave = async () => {
    if (!user) return;
    if (messages.length < 2) return;

    setIsSaving(true);
    try {
      const conversationText = messages.map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n\n');
      const summaryData = await generateEntrySummary(conversationText, user.uid);

      const entry: JournalEntry = {
        id: 'journal-' + Date.now(),
        userId: user.uid,
        title: DOMPurify.sanitize(summaryData.title),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        summary: DOMPurify.sanitize(summaryData.summary),
        keyTakeaways: summaryData.keyTakeaways.map(t => DOMPurify.sanitize(t)),
        sentiment: summaryData.sentiment,
        tags: summaryData.tags.map(t => DOMPurify.sanitize(t)),
        emotionalTone: DOMPurify.sanitize(summaryData.emotionalTone),
        chatHistory: messages,
        personaUsed: 'Empathetic Reflector',
        createdAt: Date.now()
      };

      await saveUserJournal(user.uid, entry);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#c2ab77', '#a34836', '#8b8065']
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      onEntrySaved();
    } catch (err) {
      console.error('[Save Error]', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="biovault-container">
      {/* Left Vertical Inset Groove Track with Metallic Handle & Thread */}
      <div className="left-slider-track">
        <div className="vertical-thread-line"></div>
        <div className="slider-node"></div>
        <div className="slider-node"></div>
        <div className="slider-handle-pill"></div>
        <div className="slider-node"></div>
        <div className="slider-node"></div>
      </div>

      {/* Main Folder Wrapper */}
      <div className="folder-wrapper">
        {/* Top Folder Header Tabs Bar */}
        <div className="folder-tabs-bar">
          <h2 className="folder-title-tag">Archive View</h2>

          <div className="tabs-group">
            <button
              className={`folder-tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <BookOpen className="nano-icon" /> Journal Vault
            </button>
            <button
              className={`folder-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart3 className="nano-icon" /> Mood Spectrum
            </button>
            <button
              className={`folder-tab-btn ${activeTab === 'insights' ? 'active' : ''}`}
              onClick={() => setActiveTab('insights')}
            >
              <Sparkles className="nano-icon" /> AI Insights
            </button>
          </div>
        </div>

        {/* Main Folder Content Body Card */}
        <div className="folder-body-card">
          {/* Header View with Book-Lock Vector Artwork */}
          <div className="archive-view-header">
            <div className="archive-header-text">
              <h3>Journal Entry (Confidential Archive)</h3>
              <div className="timestamp-sub">Dec 15, 2023 | 04:03 PM</div>
            </div>
            <BookLockVector size={125} />
          </div>

          {/* Messages Stream */}
          <div className="archive-chat-scroll">
            {messages.map(m => (
              <div key={m.id} className={`message-bubble-biovault ${m.role}`}>
                <div className="archive-welcome-text">
                  {m.text.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message-bubble-biovault model">
                <div className="archive-welcome-text">
                  <em>BioVault AI is indexing and reflecting...</em>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Terracotta Rust Action Bar (#A34836) */}
          <div className="terracotta-action-bar">
            <button 
              className="btn-dictate"
              onClick={openVoiceModal}
              title="Dictate Record (Web Speech API)"
            >
              <Mic className="nano-icon" /> Dictate
            </button>

            <input
              type="text"
              className="terracotta-input"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Add a new record..."
            />

            <button 
              className="btn-check-submit"
              disabled={!inputText.trim() || isTyping}
              onClick={() => handleSend()}
              title="Submit Record"
            >
              <Check size={24} />
            </button>
          </div>

          {/* Folder Sub-Footer */}
          <div className="folder-sub-footer">
            <button 
              className="link-recent-records" 
              onClick={() => setActiveTab('history')}
            >
              <RotateCcw className="nano-icon" /> View Recent Records
            </button>

            <div className="flex-center">
              {saveSuccess && (
                <span className="save-toast" style={{ marginRight: '0.8rem', color: '#FAF6EE' }}>
                  <CheckCircle2 className="nano-icon" /> Entry Archived!
                </span>
              )}
              <button
                className="btn-export-close"
                disabled={messages.length < 2 || isSaving}
                onClick={handleSummarizeAndSave}
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="nano-icon spinner" /> Archiving...
                  </>
                ) : (
                  <>
                    <Lock className="nano-icon" /> Export & Close Session
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sparkle Star Accent Glimmer (✦) at Bottom Right */}
          <SparkleStar size={24} className="sparkle-accent-floating" />
        </div>
      </div>
    </div>
  );
};
