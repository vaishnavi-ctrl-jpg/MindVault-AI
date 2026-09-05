import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChatMessage, JournalEntry } from '../types';
import { sendChatMessage, generateEntrySummary } from '../services/api';
import { saveUserJournal } from '../services/firestore';
import { BookLockVector } from './BioVaultLogo';
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
      text: `Hello! Welcome to your local **BioVault** archive. Your confidential notes and records in this private space are reserved for your own review and goal tracking.\n\nAll entries are secured in personal database isolation and local GCM-256 key-based protection. What will you archive or review today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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

  const formattedCurrentTime = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) + ' | ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="biovault-container">
      {/* Vertical Thread Slider Bar */}
      <div className="thread-slider-bar">
        <div className="thread-line">
          <div className="thread-node n1"></div>
          <div className="thread-node n2"></div>
          <div className="thread-handle"></div>
          <div className="thread-node n3"></div>
          <div className="thread-node n4"></div>
        </div>
      </div>

      {/* Main Folder Wrapper */}
      <div className="folder-wrapper">
        {/* Top Cut-Out Tabs Bar */}
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

        {/* Folder Main Content Body Card */}
        <div className="folder-body-card">
          {/* Header Info with Vector Art */}
          <div className="archive-view-header">
            <div className="archive-header-text">
              <h3>Journal Entry (Confidential Archive)</h3>
              <div className="timestamp-sub">{formattedCurrentTime}</div>
            </div>
            <BookLockVector size={110} />
          </div>

          {/* Chat Messages Stream */}
          <div className="archive-chat-scroll">
            {messages.map(m => (
              <div key={m.id} className={`message-bubble-biovault ${m.role}`}>
                <div className="archive-text-block">
                  {m.text.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message-bubble-biovault model">
                <div className="archive-text-block">
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
              <Check size={22} />
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
                <span className="save-toast text-emerald" style={{ marginRight: '0.8rem', color: '#FAF6EE' }}>
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
        </div>
      </div>
    </div>
  );
};
