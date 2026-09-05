import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, LogIn, Sparkles, X, Globe, UserCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signInWithGoogle, signInAsGuest, signInEmail, signUpEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isSignUp) {
        await signUpEmail(email, password);
      } else {
        await signInEmail(email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    }
  };

  const handleGoogle = async () => {
    await signInWithGoogle();
    onClose();
  };

  const handleGuest = () => {
    signInAsGuest();
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content-small" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex-center">
            <Sparkles className="modal-header-icon text-indigo" />
            <h3 className="modal-title">Firebase User Auth</h3>
          </div>
          <button className="btn-modal-close" onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="auth-body">
          <p className="auth-desc">
            Sign in to unlock isolated cloud storage for your Gemini AI journal.
          </p>

          <button className="btn-google-auth" onClick={handleGoogle}>
            <Globe className="google-icon" />
            <span>Sign In with Google</span>
          </button>

          <div className="divider-row">
            <span>OR</span>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <input
                type="email"
                className="form-input"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-input"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="btn-primary-action full-width">
              {isSignUp ? 'Create Account' : 'Sign In with Email'}
            </button>
          </form>

          <div className="auth-toggle-wrap">
            <button className="btn-link-toggle" onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </button>
          </div>

          <div className="sandbox-footer">
            <button className="btn-guest-sandbox" onClick={handleGuest}>
              <UserCheck className="nano-icon" /> Enter Guest Sandbox Mode (Instant Reviewer Test)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
