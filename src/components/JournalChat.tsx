import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChatMessage, JournalEntry } from '../types';
import { sendChatMessage, generateEntrySummary } from '../services/api';
import { saveUserJournal } from '../services/firestore';
import { BookLockVector, OpenBookIcon, BarChartIcon, SparkleDoubleIcon } from './BioVaultLogo';
import DOMPurify from 'dompurify';
import confetti from 'canvas-confetti';
import { 
  Mic, 
  Check, 
  RotateCcw, 
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
      {/* Left Vertical Slider — verified SVG, transparent background */}
      <div className="left-slider-track">
        <svg width="100" height="600" viewBox="0 0 100 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Warm white halo glow behind diamond */}
            <radialGradient id="halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#FFFEF5" stopOpacity="1"/>
              <stop offset="40%"  stopColor="#F5EDCC" stopOpacity="0.7"/>
              <stop offset="100%" stopColor="#C8A84A" stopOpacity="0"/>
            </radialGradient>
            {/* Amber/brass pill gradient left→right */}
            <linearGradient id="pillAmber" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#E8C45A"/>
              <stop offset="35%"  stopColor="#C08820"/>
              <stop offset="100%" stopColor="#7A5010"/>
            </linearGradient>
          </defs>

          {/* ① Full-height cream pole — thick, rounded ends */}
          <rect x="42" y="0" width="16" height="600" rx="8" fill="#EDE0C0"/>
          <rect x="46"   y="0" width="2"   height="600" fill="#D4BF88" opacity="0.45"/>
          <rect x="50.5" y="0" width="1.2" height="600" fill="#F8F0E0" opacity="0.35"/>

          {/* ② Top bracket — 3 dots, 2 C-curve arcs bowing LEFT */}
          <path d="M50 105 C30 105, 18 130, 18 158"
                stroke="#8B3030" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
          <path d="M18 158 C18 186, 30 200, 50 200"
                stroke="#8B3030" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
          <circle cx="50" cy="105" r="5.5" fill="#7A2418"/>
          <circle cx="18" cy="158" r="5.5" fill="#7A2418"/>
          <circle cx="50" cy="200" r="5.5" fill="#7A2418"/>

          {/* ③ Bottom bracket — same shape, lower */}
          <path d="M50 390 C30 390, 18 415, 18 443"
                stroke="#8B3030" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
          <path d="M18 443 C18 471, 30 485, 50 485"
                stroke="#8B3030" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
          <circle cx="50" cy="390" r="5.5" fill="#7A2418"/>
          <circle cx="18" cy="443" r="5.5" fill="#7A2418"/>
          <circle cx="50" cy="485" r="5.5" fill="#7A2418"/>

          {/* ④ Warm white halo glow */}
          <ellipse cx="50" cy="295" rx="62" ry="62" fill="url(#halo)"/>

          {/* ⑤ Solid opaque cream diamond */}
          <path d="M50 242 L96 288 L50 334 L4 288 Z" fill="#F2ECD8" opacity="0.95"/>

          {/* ⑥ Amber pill on top */}
          <rect x="36" y="254" width="28" height="68" rx="14"
                fill="url(#pillAmber)" stroke="#8A6020" strokeWidth="1.2"/>
          <rect x="39" y="260" width="7" height="28" rx="3.5"
                fill="white" opacity="0.28"/>
        </svg>
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
              <OpenBookIcon size={30} />
              <span className="tab-label-text">Journal<br/>Vault</span>
            </button>

            <button
              className={`folder-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <BarChartIcon size={30} />
              <span className="tab-label-text">Mood<br/>Spectrum</span>
            </button>

            <button
              className={`folder-tab-btn ${activeTab === 'insights' ? 'active' : ''}`}
              onClick={() => setActiveTab('insights')}
            >
              <SparkleDoubleIcon size={30} />
              <span className="tab-label-text">AI<br/>Insights</span>
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
                    <p key={i}>
                      {line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={j}>{part.slice(2, -2)}</strong>;
                        }
                        return part;
                      })}
                    </p>
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


        </div>
      </div>
    </div>
  );
};
