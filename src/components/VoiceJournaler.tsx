import React, { useState, useEffect } from 'react';
import { Mic, MicOff, X, Check, Volume2, Sparkles } from 'lucide-react';

interface VoiceJournalerProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscriptComplete: (text: string) => void;
}

export const VoiceJournaler: React.FC<VoiceJournalerProps> = ({
  isOpen,
  onClose,
  onTranscriptComplete
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;

      rec.onresult = (event: any) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);
      };

      rec.onerror = (err: any) => {
        console.warn('Speech recognition error', err);
        setIsListening(false);
      };

      setRecognition(rec);
    }
  }, []);

  if (!isOpen) return null;

  const toggleListen = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in this browser. Please type directly into the chat.');
      return;
    }
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognition.start();
      setIsListening(true);
    }
  };

  const handleDone = () => {
    if (isListening && recognition) {
      recognition.stop();
    }
    onTranscriptComplete(transcript);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content-medium voice-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex-center">
            <Volume2 className="modal-header-icon text-indigo" />
            <h3 className="modal-title">AI Voice Journaler</h3>
          </div>
          <button className="btn-modal-close" onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="voice-body">
          <p className="voice-instruction">
            Speak naturally. Gemini will record, transcribe, and structure your vocal reflections.
          </p>

          {/* Waveform Visualizer */}
          <div className={`waveform-box ${isListening ? 'active' : ''}`}>
            <div className="wave-bar bar1"></div>
            <div className="wave-bar bar2"></div>
            <div className="wave-bar bar3"></div>
            <div className="wave-bar bar4"></div>
            <div className="wave-bar bar5"></div>
          </div>

          {/* Record Button */}
          <button 
            className={`btn-mic-toggle ${isListening ? 'recording' : ''}`}
            onClick={toggleListen}
          >
            {isListening ? (
              <>
                <MicOff className="mic-btn-icon" /> Stop Recording
              </>
            ) : (
              <>
                <Mic className="mic-btn-icon" /> Start Recording
              </>
            )}
          </button>

          {/* Live Transcript Preview Box */}
          <div className="transcript-preview-box">
            <span className="preview-label">Live Transcription:</span>
            <p className="preview-text">
              {transcript || (isListening ? 'Listening to your voice...' : 'Click Start Recording to begin...')}
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="btn-primary-action"
            disabled={!transcript.trim()}
            onClick={handleDone}
          >
            <Check className="nano-icon" /> Use Transcript in Chat
          </button>
        </div>
      </div>
    </div>
  );
};
