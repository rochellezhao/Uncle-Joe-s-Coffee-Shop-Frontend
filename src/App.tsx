/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './views/Home';
import Locations from './views/Locations';
import Menu from './views/Menu';
import Login from './views/Login';
import { GuestUser } from './types';

type Page = 'home' | 'locations' | 'menu' | 'login';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [guest, setGuest] = useState<GuestUser | null>(null);

  // Sync with localStorage
  useEffect(() => {
    const savedGuest = localStorage.getItem('guest_user');
    if (savedGuest) {
      try {
        setGuest(JSON.parse(savedGuest));
      } catch (e) {
        console.error('Failed to parse guest user from storage', e);
      }
    }
  }, []);

  const handleSignIn = (name: string) => {
    const user: GuestUser = { name, signInTime: Date.now() };
    setGuest(user);
    localStorage.setItem('guest_user', JSON.stringify(user));
    setCurrentPage('home');
  };

  const handleSignOut = () => {
    setGuest(null);
    localStorage.removeItem('guest_user');
    setCurrentPage('login');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} guestName={guest?.name} />;
      case 'locations':
        return <Locations />;
      case 'menu':
        return <Menu />;
      case 'login':
        return <Login onSignIn={handleSignIn} />;
      default:
        return <Home onNavigate={setCurrentPage} guestName={guest?.name} />;
    }
  };

  return (
    <div className="min-h-screen bg-coffee-paper font-sans text-coffee-dark selection:bg-coffee-accent selection:text-white flex flex-col">
      <Navbar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        guestName={guest?.name}
        onSignOut={handleSignOut}
      />
      
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
