import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, Mail, Lock, Coffee, User as UserIcon } from 'lucide-react';

import { coffeeApi } from '../services/api';
import { User as UserType, GuestUser } from '../types';

interface LoginProps {
  onLogin: (user: UserType | GuestUser) => void;
  navigate: (path: string) => void;
}

export default function Login({ onLogin, navigate }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [guestName, setGuestName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'guest' | 'signin'>('guest');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (mode === 'guest') {
        const guest: GuestUser = { 
          name: guestName.trim() || 'Valued Guest', 
          signInTime: Date.now() 
        };
        localStorage.setItem("app_user", JSON.stringify(guest));
        onLogin(guest);
        navigate("/");
        return;
      } else {
        const data = await coffeeApi.login(email.trim(), password);
        console.log("RAW LOGIN RESPONSE:", data);

        const source = data.data || data;
        
        // Robust success check: handle boolean/string and nested markers
        const isAuth = source.authenticated === true || 
                       source.authenticated === 'true' || 
                       data.authenticated === true ||
                       data.authenticated === 'true' ||
                       data.status === 'success' ||
                       source.status === 'success' ||
                       !!source.member_id;
        
        if (isAuth) {
          // Robust name extraction
          const nameFields = [source.name, source.firstName, source.first_name, source.displayName, source.username];
          let extractedName = nameFields.find(f => f && typeof f === 'string') || 'Member';

          if (data.message && data.message.toUpperCase().includes('WELCOME TO THE PILOT, ')) {
            const parts = data.message.toUpperCase().split('WELCOME TO THE PILOT, ');
            if (parts.length > 1) {
              const nameFromMsg = parts[1].split(/[.!]/)[0].trim();
              if (nameFromMsg) extractedName = nameFromMsg;
            }
          }

          // Exhaustive member_id resolution logic as per user requirement
          const resolvedMemberId = data.person_id ||
                                   data.member_id || 
                                   data.memberId || 
                                   data.id || 
                                   data.user_id || 
                                   data.user?.person_id ||
                                   data.user?.member_id || 
                                   data.user?.memberId || 
                                   data.user?.id || 
                                   data.account?.person_id ||
                                   data.account?.member_id || 
                                   data.account?.id ||
                                   source.person_id ||
                                   source.member_id ||
                                   source.id;

          // Build exact userSession as requested
          const userSession = {
            authenticated: true,
            member_id: resolvedMemberId,
            name: data.name ?? data.user?.name ?? data.account?.name ?? extractedName ?? "",
            email: data.email ?? data.user?.email ?? data.account?.email ?? source.email ?? ""
          };

          console.log("SESSION BEFORE SAVE:", userSession);
          localStorage.setItem("app_user", JSON.stringify(userSession));
          
          if (source.token) {
            coffeeApi.setToken(source.token);
          }

          onLogin(userSession as any);
          navigate("/");
          return;
        } else {
          setError(data.message || source.message || "Invalid credentials. Please try again.");
          setLoading(false);
        }
      }
    } catch (err: any) {
      console.error('LOGIN ERROR:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
      setLoading(false);
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

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-[10px] uppercase tracking-widest font-bold px-4 py-3 text-center">
            {error}
          </div>
        )}

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
                <UserIcon className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee-dark/30" />
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
