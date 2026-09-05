import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { JournalEntry } from '../types';
import { getUserJournals, deleteUserJournal } from '../services/firestore';
import { 
  Search, 
  Tag, 
  Trash2, 
  Calendar, 
  Smile, 
  FileText, 
  ChevronRight, 
  X, 
  Bot, 
  User as UserIcon,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface JournalHistoryProps {
  refreshTrigger: number;
}

export const JournalHistory: React.FC<JournalHistoryProps> = ({ refreshTrigger }) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [activeEntry, setActiveEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      setLoading(true);
      const list = await getUserJournals(user.uid);
      setEntries(list);
      setLoading(false);
    }
    loadData();
  }, [user, refreshTrigger]);

  const handleDelete = async (e: React.MouseEvent, entryId: string) => {
    e.stopPropagation();
    if (!user) return;
    if (confirm('Are you sure you want to delete this entry from your vault?')) {
      await deleteUserJournal(user.uid, entryId);
      setEntries(prev => prev.filter(item => item.id !== entryId));
      if (activeEntry?.id === entryId) setActiveEntry(null);
    }
  };

  // Collect unique tags across entries
  const allTags = Array.from(new Set(entries.flatMap(e => e.tags || [])));

  // Filter entries
  const filteredEntries = entries.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.emotionalTone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? item.tags?.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="history-container">
      {/* Search & Tag Filter Bar */}
      <div className="filter-bar">
        <div className="search-input-wrap">
          <Search className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search entries by title, keyword, or tone..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="btn-clear-search" onClick={() => setSearchQuery('')}>
              <X className="nano-icon" />
            </button>
          )}
        </div>

        {/* Tag Filters */}
        <div className="tag-filter-pills">
          <button 
            className={`tag-pill ${selectedTag === null ? 'active' : ''}`}
            onClick={() => setSelectedTag(null)}
          >
            All Tags
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              className={`tag-pill ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            >
              <Tag className="nano-icon" /> {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Entry Cards List */}
      {loading ? (
        <div className="loading-state">
          <Zap className="nano-icon spinner" /> Loading your isolated MindVault entries...
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="empty-state">
          <FileText className="empty-icon" />
          <h3>No Journal Entries Found</h3>
          <p>Start a new reflection in the AI Journal tab to summarize and save your thoughts securely.</p>
        </div>
      ) : (
        <div className="journal-grid">
          {filteredEntries.map(entry => (
            <div 
              key={entry.id} 
              className="journal-card"
              onClick={() => setActiveEntry(entry)}
            >
              <div className="card-header">
                <span className="entry-date">
                  <Calendar className="nano-icon" /> {entry.date}
                </span>
                <span className="tone-badge">
                  <Smile className="nano-icon" /> {entry.emotionalTone}
                </span>
              </div>

              <h3 className="card-title">{entry.title}</h3>
              <p className="card-summary">{entry.summary}</p>

              {/* Sentiment Mini Indicators */}
              <div className="sentiment-indicators">
                <div className="sentiment-bar-wrap" title={`Positivity: ${entry.sentiment?.positivity}%`}>
                  <span className="bar-label">Positivity</span>
                  <div className="bar-track">
                    <div className="bar-fill pos" style={{ width: `${entry.sentiment?.positivity || 70}%` }}></div>
                  </div>
                </div>
                <div className="sentiment-bar-wrap" title={`Clarity: ${entry.sentiment?.clarity}%`}>
                  <span className="bar-label">Clarity</span>
                  <div className="bar-track">
                    <div className="bar-fill cla" style={{ width: `${entry.sentiment?.clarity || 80}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <div className="card-tags">
                  {entry.tags?.slice(0, 3).map(tag => (
                    <span key={tag} className="mini-tag">{tag}</span>
                  ))}
                </div>
                <button 
                  className="btn-delete-entry"
                  onClick={e => handleDelete(e, entry.id)}
                  title="Delete Entry"
                >
                  <Trash2 className="nano-icon" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Entry Detail Modal */}
      {activeEntry && (
        <div className="modal-backdrop" onClick={() => setActiveEntry(null)}>
          <div className="modal-content-large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-subtitle">
                  <ShieldCheck className="nano-icon text-emerald" /> User Isolated Storage: /users/{user?.uid.substring(0,6)}.../journals/{activeEntry.id}
                </span>
                <h2 className="modal-title">{activeEntry.title}</h2>
              </div>
              <button className="btn-modal-close" onClick={() => setActiveEntry(null)}>
                <X />
              </button>
            </div>

            <div className="modal-body-scroll">
              <div className="detail-section">
                <h4>Executive Summary</h4>
                <p className="summary-text">{activeEntry.summary}</p>
              </div>

              <div className="detail-section">
                <h4>Key Takeaways</h4>
                <ul className="takeaways-list">
                  {activeEntry.keyTakeaways?.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="detail-section">
                <h4>Full Gemini Chat Transcript</h4>
                <div className="transcript-box">
                  {activeEntry.chatHistory?.map(m => (
                    <div key={m.id} className={`transcript-row ${m.role}`}>
                      <span className="transcript-role">{m.role === 'model' ? `Gemini (${activeEntry.personaUsed})` : 'You'}:</span>
                      <p className="transcript-text">{m.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
