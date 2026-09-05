import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { JournalEntry } from '../types';
import { getUserJournals } from '../services/firestore';
import { 
  Chart as ChartJS, 
  RadialLinearScale, 
  PointElement, 
  LineElement, 
  Filler, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale
} from 'chart.js';
import { Radar, Line } from 'react-chartjs-2';
import { Activity, Sparkles, TrendingUp, Heart, Zap, Brain } from 'lucide-react';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
);

export const MoodAnalytics: React.FC = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;
      setLoading(false);
      const data = await getUserJournals(user.uid);
      setEntries(data);
    }
    load();
  }, [user]);

  // Compute averages
  const avgPositivity = Math.round(entries.reduce((acc, e) => acc + (e.sentiment?.positivity || 70), 0) / (entries.length || 1));
  const avgClarity = Math.round(entries.reduce((acc, e) => acc + (e.sentiment?.clarity || 80), 0) / (entries.length || 1));
  const avgEnergy = Math.round(entries.reduce((acc, e) => acc + (e.sentiment?.energy || 65), 0) / (entries.length || 1));
  const avgAnxiety = Math.round(entries.reduce((acc, e) => acc + (e.sentiment?.anxiety || 20), 0) / (entries.length || 1));

  // Radar Data
  const radarData = {
    labels: ['Positivity', 'Cognitive Clarity', 'Mental Energy', 'Calmness (100 - Anxiety)'],
    datasets: [
      {
        label: 'Current Emotional Spectrum',
        data: [avgPositivity, avgClarity, avgEnergy, 100 - avgAnxiety],
        backgroundColor: 'rgba(99, 102, 241, 0.25)',
        borderColor: '#6366f1',
        borderWidth: 2,
        pointBackgroundColor: '#a855f7',
        pointBorderColor: '#fff',
      },
    ],
  };

  // Timeline Data
  const timelineLabels = entries.slice().reverse().map(e => e.date || 'Entry');
  const lineData = {
    labels: timelineLabels.length > 0 ? timelineLabels : ['Day 1', 'Day 2', 'Day 3', 'Day 4'],
    datasets: [
      {
        label: 'Positivity %',
        data: entries.slice().reverse().map(e => e.sentiment?.positivity || 75),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Clarity %',
        data: entries.slice().reverse().map(e => e.sentiment?.clarity || 85),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Anxiety %',
        data: entries.slice().reverse().map(e => e.sentiment?.anxiety || 15),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ],
  };

  return (
    <div className="analytics-container">
      <div className="section-title-wrap">
        <Activity className="section-title-icon text-indigo" />
        <div>
          <h2>Cognitive & Mood Spectrum Analytics</h2>
          <p>Real-time emotional valence tracking derived from Gemini AI natural language analysis.</p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        <div className="kpi-card positivity">
          <div className="kpi-header">
            <span>Positivity Index</span>
            <Heart className="kpi-icon text-emerald" />
          </div>
          <div className="kpi-value">{avgPositivity}%</div>
          <span className="kpi-subtext">High emotional resilience</span>
        </div>

        <div className="kpi-card clarity">
          <div className="kpi-header">
            <span>Cognitive Clarity</span>
            <Brain className="kpi-icon text-indigo" />
          </div>
          <div className="kpi-value">{avgClarity}%</div>
          <span className="kpi-subtext">Strong focus & goal alignment</span>
        </div>

        <div className="kpi-card energy">
          <div className="kpi-header">
            <span>Vitality & Energy</span>
            <Zap className="kpi-icon text-amber" />
          </div>
          <div className="kpi-value">{avgEnergy}%</div>
          <span className="kpi-subtext">Optimal motivation level</span>
        </div>

        <div className="kpi-card anxiety">
          <div className="kpi-header">
            <span>Anxiety Index</span>
            <TrendingUp className="kpi-icon text-rose" />
          </div>
          <div className="kpi-value">{avgAnxiety}%</div>
          <span className="kpi-subtext">Low stress footprint</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Radar Spectrum Profile</h3>
          <div className="chart-wrapper">
            <Radar data={radarData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="chart-card">
          <h3>Mood & Clarity Trajectory</h3>
          <div className="chart-wrapper">
            <Line data={lineData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
};
