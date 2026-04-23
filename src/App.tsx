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
import OrderHistory from './views/OrderHistory';
import { GuestUser, User } from './types';
import { coffeeApi } from './services/api';

type Page = 'home' | 'locations' | 'menu' | 'login' | 'order-history';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentUser, setCurrentUser] = useState<User | GuestUser | null>(null);

  // 6. Refreshing the page must restore the user from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("app_user");
    if (saved) {
      try {
        const restoredSession = JSON.parse(saved);
        console.log("RESTORED SESSION:", restoredSession);
        setCurrentUser(restoredSession);
        // Sync token with API if it's a Member user
        if ('token' in restoredSession && restoredSession.token) {
          coffeeApi.setToken(restoredSession.token);
        }
      } catch (e) {
        console.error("Failed to restore session:", e);
        localStorage.removeItem("app_user");
      }
    }
  }, []);

  const handleLogin = (userSession: User | GuestUser) => {
    // 4. The global app auth state is updated
    setCurrentUser(userSession);
    
    // Sync token with API immediately if it's a Member user
    if ('token' in userSession && userSession.token) {
      coffeeApi.setToken(userSession.token);
    }
    
    // 6. The user is redirected to "/" immediately (Home page)
    setCurrentPage('home');
  };

  const handleLogout = () => {
    // 7. Logout must clear localStorage and reset the app state
    console.log("LOGGING OUT: Clearing state and localStorage");
    localStorage.removeItem("app_user");
    setCurrentUser(null);
    coffeeApi.setToken(null);
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} guestName={currentUser?.name} />;
      case 'locations':
        return <Locations />;
      case 'menu':
        return <Menu />;
      case 'order-history':
        return <OrderHistory currentUser={currentUser} />;
      case 'login':
        return (
          <Login 
            onLogin={handleLogin} 
            navigate={(path: string) => {
              if (path === '/') setCurrentPage('home');
              else if (path === '/login') setCurrentPage('login');
              // handle other paths if needed
            }} 
          />
        );
      default:
        return <Home onNavigate={setCurrentPage} guestName={currentUser?.name} />;
    }
  };

  return (
    <div className="min-h-screen bg-coffee-paper font-sans text-coffee-dark selection:bg-coffee-accent selection:text-white flex flex-col">
      <Navbar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        currentUser={currentUser}
        onSignOut={handleLogout}
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
