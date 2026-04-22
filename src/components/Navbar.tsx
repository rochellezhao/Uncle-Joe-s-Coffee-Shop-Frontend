import { Coffee } from 'lucide-react';

import { User, LogOut } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: any) => void;
  guestName?: string;
  onSignOut: () => void;
}

export default function Navbar({ currentPage, onNavigate, guestName, onSignOut }: NavbarProps) {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'locations', label: 'Locations' },
    { id: 'menu', label: 'Menu' },
    { id: 'login', label: 'Login', hidden: !!guestName },
  ].filter(i => !i.hidden);

  return (
    <header className="flex justify-between items-end px-12 py-8 border-b border-black/5 bg-coffee-paper sticky top-0 z-50">
      <div 
        className="flex flex-col cursor-pointer group"
        onClick={() => onNavigate('home')}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] opacity-60 mb-1">Est. 1994</span>
        <h1 className="font-serif text-4xl font-bold tracking-tight text-coffee-dark">Uncle Joe's</h1>
      </div>

      <div className="flex items-end gap-12">
        <nav className="flex gap-12 text-sm uppercase tracking-widest font-semibold pb-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`cursor-pointer transition-colors relative group ${
                currentPage === item.id ? 'text-coffee-dark' : 'text-coffee-dark/40 hover:text-coffee-dark'
              }`}
            >
              {item.label}
              <div className={`absolute -bottom-1 left-0 h-px bg-coffee-dark transition-all duration-300 ${
                currentPage === item.id ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </button>
          ))}
        </nav>

        {guestName && (
          <div className="flex items-center gap-6 pb-1 border-l border-black/5 pl-8">
            <div className="flex items-center gap-2 text-coffee-dark/60">
              <User className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-widest font-bold">{guestName}</span>
            </div>
            <button 
              onClick={onSignOut}
              className="text-[10px] uppercase tracking-widest font-bold text-coffee-dark/40 hover:text-red-600 transition-colors flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" /> Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
