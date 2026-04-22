import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, Mail, Lock, Coffee, User } from 'lucide-react';

interface LoginProps {
  onSignIn: (name: string) => void;
}

export default function Login({ onSignIn }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [guestName, setGuestName] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'signin' | 'guest'>('guest');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (mode === 'guest') {
      setTimeout(() => {
        onSignIn(guestName || 'Valued Guest');
        setLoading(false);
      }, 800);
    } else {
      setTimeout(() => {
        setLoading(false);
        alert('Traditional login is currently in maintenance. Please use Guest Sign-In.');
        setMode('guest');
      }, 1000);
    }
  };

  return (
    <div className="px-12 py-20 flex justify-center items-center min-h-[70vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white border border-black/5 p-12 shadow-2xl space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-coffee-paper rounded-full mb-4">
            <Coffee className="w-6 h-6 text-coffee-dark" />
          </div>
          <h2 className="font-serif text-3xl text-coffee-dark">
            {mode === 'signin' ? 'Member Access' : 'Guest Sign-In'}
          </h2>
          <p className="text-xs uppercase tracking-widest text-coffee-dark/50">
            {mode === 'signin' ? 'Sign in to your roasted rewards' : 'Enter your name to continue as a guest'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signin' ? (
            <>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-coffee-dark/60 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee-dark/30" />
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-8 py-3 border-b border-black/10 outline-none focus:border-coffee-dark transition-colors text-sm"
                    placeholder="joe@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-coffee-dark/60 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee-dark/30" />
                  <input 
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-8 py-3 border-b border-black/10 outline-none focus:border-coffee-dark transition-colors text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-coffee-dark/60 block">
                Your Name
              </label>
              <div className="relative">
                <User className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee-dark/30" />
                <input 
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full pl-8 py-3 border-b border-black/10 outline-none focus:border-coffee-dark transition-colors text-sm"
                  placeholder="Uncle Joe"
                />
              </div>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-coffee-dark text-white py-4 text-xs uppercase tracking-widest hover:bg-coffee-accent transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Processing...' : (
              mode === 'signin' ? <>Sign In <LogIn className="w-4 h-4" /></> : 'Continue as Guest'
            )}
          </button>
        </form>

        <div className="flex flex-col gap-4 text-[10px] uppercase tracking-widest font-semibold text-coffee-dark/40 pt-4 border-t border-black/5">
          <button 
            onClick={() => setMode(mode === 'signin' ? 'guest' : 'signin')}
            className="hover:text-coffee-dark transition-colors text-center"
          >
            {mode === 'signin' ? 'Or Continue as Guest' : 'Already a Member? Sign In'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
