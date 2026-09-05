import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserJournals } from '../services/firestore';
import { fetchAIInsights } from '../services/api';
import { Sparkles, Brain, Compass, Lightbulb, ArrowRight, RefreshCw, CheckCircle } from 'lucide-react';

interface InsightEngineProps {
  onSelectPrompt: (promptText: string) => void;
}

export const InsightEngine: React.FC<InsightEngineProps> = ({ onSelectPrompt }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [insightData, setInsightData] = useState<{
    overallInsight: string;
    topThemes: string[];
    recommendedPrompts: string[];
  } | null>(null);

  useEffect(() => {
    async function load() {
      if (!user) return;
      setLoading(true);
      const journals = await getUserJournals(user.uid);
      const data = await fetchAIInsights(journals);
      setInsightData(data);
      setLoading(false);
    }
    load();
  }, [user]);

  return (
    <div className="insights-container">
      <div className="section-title-wrap">
        <Sparkles className="section-title-icon text-purple" />
        <div>
          <h2>Cognitive Reflection & Pattern Insights</h2>
          <p>Gemini AI synthesizes memory vectors and emotional milestones across your entire vault.</p>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <RefreshCw className="nano-icon spinner" /> Synthesizing vault memory vectors with Gemini...
        </div>
      ) : (
        <div className="insights-grid">
          {/* Main Synthetic Insight Card */}
          <div className="insight-card hero-insight">
            <div className="insight-card-header">
              <Brain className="card-header-icon" />
              <h3>Gemini Memory Synthesis</h3>
            </div>
            <p className="hero-insight-text">{insightData?.overallInsight}</p>

            <div className="top-themes-wrap">
              <span className="themes-label">Top Recurring Themes:</span>
              <div className="themes-pills">
                {insightData?.topThemes.map((theme, i) => (
                  <span key={i} className="theme-pill">
                    <CheckCircle className="nano-icon" /> {theme}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Reflection Prompts */}
          <div className="insight-card prompts-card">
            <div className="insight-card-header">
              <Compass className="card-header-icon text-indigo" />
              <h3>Tailored Reflection Prompts</h3>
            </div>
            <p className="card-desc">Click any prompt to start a guided reflection with Gemini:</p>

            <div className="prompts-list">
              {insightData?.recommendedPrompts.map((prompt, i) => (
                <div 
                  key={i} 
                  className="prompt-action-item"
                  onClick={() => onSelectPrompt(prompt)}
                >
                  <div className="prompt-action-text">
                    <Lightbulb className="prompt-bulb" />
                    <span>{prompt}</span>
                  </div>
                  <ArrowRight className="prompt-arrow" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
