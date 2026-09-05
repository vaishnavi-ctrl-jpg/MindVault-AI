import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { AIPersona, ChatMessage, JournalEntry } from '../types';
import { sendChatMessage, generateEntrySummary } from '../services/api';
import { saveUserJournal } from '../services/firestore';
import DOMPurify from 'dompurify';
import confetti from 'canvas-confetti';
import { 
  Send, 
  Sparkles, 
  Mic, 
  Save, 
  RefreshCw, 
  Bot, 
  User as UserIcon, 
  CheckCircle2, 
  Brain,
  Zap
} from 'lucide-react';

interface JournalChatProps {
  onEntrySaved: () => void;
  openVoiceModal: () => void;
  recordedVoiceText?: string;
  clearVoiceText?: () => void;
}

const PERSONAS: { name: AIPersona; desc: string; icon: string }[] = [
  { name: 'Empathetic Reflector', desc: 'Emotional validation & gentle probing', icon: '🌸' },
  { name: 'Strategic Planner', desc: 'Actionable steps & priority breakdown', icon: '🎯' },
  { name: 'Creative Ideator', desc: 'Expansive thinking & fresh perspectives', icon: '💡' },
  { name: 'Stoic Mindset Coach', desc: 'Resilience, regulation & cognitive clarity', icon: '🏛️' }
];

const PROMPT_STARTERS = [
  "I'm feeling overwhelmed with work and need clarity.",
  "Help me brainstorm creative solutions for my new project.",
  "I made a mistake today and want to process how to handle it.",
  "What is one positive shift I can focus on tomorrow?"
];

export const JournalChat: React.FC<JournalChatProps> = ({ 
  onEntrySaved, 
  openVoiceModal, 
  recordedVoiceText,
  clearVoiceText 
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'model',
      text: `Hello ${user?.displayName || 'there'}! Welcome to your private **MindVault**. I'm here as your confidential Gemini companion to help you process thoughts, set goals, or journal freely.\n\nEverything you record here is protected by **zero-trust user database isolation**, AES-GCM-256 encryption, and Secret Manager key security.\n\n*What would you like to reflect on today?*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [persona, setPersona] = useState<AIPersona>('Empathetic Reflector');
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

    // DOMPurify XSS Sanitization
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
      const rawReply = await sendChatMessage(messages, sanitizedText, persona, user?.uid);
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
        personaUsed: persona,
        createdAt: Date.now()
      };

      await saveUserJournal(user.uid, entry);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#ec4899', '#10b981']
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

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset-' + Date.now(),
        role: 'model',
        text: `Starting a fresh reflection session. I'm ready whenever you are!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="chat-container">
      {/* Persona Selection Header */}
      <div className="persona-bar">
        <div className="persona-label">
          <Brain className="persona-icon-glow" />
          <span>Gemini AI Persona:</span>
        </div>
        <div className="persona-grid">
          {PERSONAS.map(p => (
            <button
              key={p.name}
              className={`persona-card ${persona === p.name ? 'selected' : ''}`}
              onClick={() => setPersona(p.name)}
            >
              <span className="persona-emoji">{p.icon}</span>
              <div className="persona-text">
                <span className="persona-name">{p.name}</span>
                <span className="persona-desc">{p.desc}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Messages Stream */}
      <div className="messages-viewport">
        {messages.map(m => (
          <div key={m.id} className={`message-bubble-row ${m.role}`}>
            <div className="avatar-badge">
              {m.role === 'model' ? <Bot className="bot-avatar" /> : <UserIcon className="user-avatar-mini" />}
            </div>
            <div className="message-content-wrapper">
              <div className="message-header-info">
                <span className="sender-name">{m.role === 'model' ? `Gemini (${persona})` : user?.displayName || 'You'}</span>
                <span className="timestamp">{m.timestamp}</span>
              </div>
              <div className="message-text">
                {m.text.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="message-bubble-row model typing">
            <div className="avatar-badge">
              <Bot className="bot-avatar" />
            </div>
            <div className="typing-indicator">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="typing-text">Gemini is reflecting...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Suggestions */}
      {messages.length < 3 && (
        <div className="prompt-starters-wrap">
          <span className="prompt-starters-title">
            <Zap className="nano-icon" /> Suggested Starters:
          </span>
          <div className="prompt-pills">
            {PROMPT_STARTERS.map((promptText, i) => (
              <button key={i} className="prompt-pill" onClick={() => handleSend(promptText)}>
                {promptText}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Control Console */}
      <div className="chat-input-bar">
        <button 
          className="btn-voice-input" 
          onClick={openVoiceModal}
          title="Record Audio Journal (Web Speech API)"
        >
          <Mic className="mic-icon" />
          <span className="voice-label">Voice</span>
        </button>

        <textarea
          className="chat-textarea"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Journal your thoughts, goals, or emotions freely... (Press Shift+Enter for new line)"
          rows={2}
        />

        <button 
          className="btn-send"
          disabled={!inputText.trim() || isTyping}
          onClick={() => handleSend()}
        >
          <Send className="send-icon" />
        </button>
      </div>

      {/* Save & Summarize Session Footer */}
      <div className="chat-footer-actions">
        <button className="btn-secondary-action" onClick={handleResetChat}>
          <RefreshCw className="nano-icon" /> New Session
        </button>

        <div className="footer-right">
          {saveSuccess && (
            <span className="save-toast">
              <CheckCircle2 className="toast-icon" /> Saved & Summarized to Isolated Firestore!
            </span>
          )}
          <button
            className="btn-save-summary"
            disabled={messages.length < 2 || isSaving}
            onClick={handleSummarizeAndSave}
          >
            {isSaving ? (
              <>
                <RefreshCw className="nano-icon spinner" /> Summarizing with Gemini...
              </>
            ) : (
              <>
                <Save className="nano-icon" /> Summarize & Save to MindVault
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
