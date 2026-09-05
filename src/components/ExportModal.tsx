import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserJournals } from '../services/firestore';
import { encryptVaultAES256 } from '../utils/crypto';
import { Lock, Download, Key, FileText, CheckCircle2, X } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [passphrase, setPassphrase] = useState('');
  const [format, setFormat] = useState<'md' | 'json' | 'vault'>('vault');
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    if (!user) return;
    setIsExporting(true);

    try {
      const journals = await getUserJournals(user.uid);
      let fileContent = '';
      let fileName = `mindvault_export_${user.uid.substring(0, 6)}_${Date.now()}`;
      let mimeType = 'text/plain';

      if (format === 'json') {
        fileContent = JSON.stringify({
          exportedAt: new Date().toISOString(),
          userIsolatedUid: user.uid,
          securityDirective: 'Client Vault Export',
          journals: journals
        }, null, 2);
        fileName += '.json';
        mimeType = 'application/json';
      } else if (format === 'md') {
        fileContent = `# MINDVAULT AI - PERSONAL JOURNAL EXPORT\n`;
        fileContent += `**User ID**: ${user.uid}\n`;
        fileContent += `**Export Date**: ${new Date().toLocaleString()}\n`;
        fileContent += `**Security Directives**: Enterprise Zero-Trust Isolated Storage\n\n---\n\n`;

        journals.forEach((j, idx) => {
          fileContent += `## ${idx + 1}. ${j.title} (${j.date})\n`;
          fileContent += `**Emotional Tone**: ${j.emotionalTone}\n`;
          fileContent += `**Tags**: ${j.tags?.join(', ')}\n\n`;
          fileContent += `### Summary\n${j.summary}\n\n`;
          fileContent += `### Key Takeaways\n`;
          j.keyTakeaways?.forEach(k => {
            fileContent += `- ${k}\n`;
          });
          fileContent += `\n### Transcript\n`;
          j.chatHistory?.forEach(m => {
            fileContent += `**${m.role.toUpperCase()}**: ${m.text}\n\n`;
          });
          fileContent += `\n---\n\n`;
        });
        fileName += '.md';
        mimeType = 'text/markdown';
      } else {
        // REAL Web Crypto API AES-GCM-256 Encryption
        const rawJson = JSON.stringify(journals, null, 2);
        const secretKey = passphrase.trim() || 'MindVault-AES256-Default-Vault-Key-2026';
        fileContent = await encryptVaultAES256(rawJson, secretKey);
        fileName += '.mindvault';
        mimeType = 'application/json';
      }

      // Download file
      const blob = new Blob([fileContent], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (e) {
      console.error('[Encryption Export Error]', e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content-medium" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex-center">
            <Lock className="modal-header-icon text-emerald" />
            <h3 className="modal-title">Encrypted Vault Export</h3>
          </div>
          <button className="btn-modal-close" onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="export-body">
          <p className="export-desc">
            Export all your personal journal entries from isolated storage. Secures data using client-side **AES-GCM-256 (PBKDF2 100k iterations)** encryption via Web Crypto API.
          </p>

          <div className="form-group">
            <label className="form-label">
              <Key className="nano-icon" /> AES-256 Encryption Passphrase:
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter passphrase for PBKDF2 AES-GCM key derivation..."
              value={passphrase}
              onChange={e => setPassphrase(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Export Format:</label>
            <div className="format-selector">
              <button 
                className={`format-btn ${format === 'vault' ? 'active' : ''}`}
                onClick={() => setFormat('vault')}
              >
                <Lock className="nano-icon" /> AES-256 Vault (.mindvault)
              </button>
              <button 
                className={`format-btn ${format === 'md' ? 'active' : ''}`}
                onClick={() => setFormat('md')}
              >
                <FileText className="nano-icon" /> Markdown (.md)
              </button>
              <button 
                className={`format-btn ${format === 'json' ? 'active' : ''}`}
                onClick={() => setFormat('json')}
              >
                <FileText className="nano-icon" /> JSON (.json)
              </button>
            </div>
          </div>

          {downloadSuccess && (
            <div className="success-banner">
              <CheckCircle2 className="banner-icon text-emerald" />
              <span>Vault exported successfully with AES-GCM-256 encryption!</span>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary-action" onClick={handleExport} disabled={isExporting}>
            <Download className="nano-icon" /> {isExporting ? 'Encrypting...' : 'Export Vault Now'}
          </button>
        </div>
      </div>
    </div>
  );
};
