import { Coffee, Github, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="px-12 py-10 border-t border-black/5 flex justify-between items-center text-[10px] uppercase tracking-[0.2em] opacity-50 text-coffee-dark bg-coffee-paper">
      <span>&copy; 2024 Uncle Joe's Coffee Co.</span>
      <div className="flex gap-8">
        <button className="hover:opacity-100 transition-opacity">Instagram</button>
        <button className="hover:opacity-100 transition-opacity">Twitter</button>
        <button className="hover:opacity-100 transition-opacity">Journal</button>
      </div>
    </footer>
  );
}
