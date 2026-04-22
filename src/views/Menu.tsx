import { useEffect, useState } from 'react';
import { Loader2, AlertCircle, Coffee, Info, X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { coffeeApi } from '../services/api';
import { MenuItem } from '../types';

export default function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const data = await coffeeApi.getMenu();
        setMenuItems(data);
        setError(null);
      } catch (err: any) {
        console.error('API Error:', err);
        setError('Unable to load menu. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const handleItemClick = async (id: string) => {
    setLoadingDetail(true);
    try {
      const data = await coffeeApi.getMenuItemById(id);
      setSelectedItem(data);
    } catch (err) {
      console.error('API Error Fetching Detail:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const categories = Array.isArray(menuItems) ? Array.from(new Set(menuItems.map(item => item.category).filter(Boolean))) : [];

  const scrollToCategory = (category: string) => {
    const element = document.getElementById(`category-${category.replace(/\s+/g, '-').toLowerCase()}`);
    if (element) {
      const yOffset = -120; // Accounting for sticky navbar
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4 min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-coffee-accent animate-spin" />
        <p className="text-coffee-accent font-medium font-serif italic text-xl uppercase tracking-widest text-xs">Grinding the beans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-40 flex flex-col items-center justify-center gap-4 text-center min-h-[60vh]">
        <div className="p-4 bg-red-50 rounded-full">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-red-600 font-bold text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="px-12 py-10 w-full min-h-screen">
      <div className="grid grid-cols-12 gap-12">
        {/* Left Sidebar */}
        <div className="col-span-12 lg:col-span-3 lg:border-r border-black/5 lg:pr-10 pb-8 lg:pb-0">
          <div className="sticky top-32 space-y-12">
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.3em] text-coffee-accent font-bold">The Roast</span>
              <h2 className="font-serif text-5xl leading-tight text-coffee-dark">Daily Selection</h2>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-coffee-dark/40">Categories</h3>
              {categories.length > 0 ? (
                <ul className="space-y-4 text-xs uppercase tracking-widest font-semibold text-coffee-dark">
                  {categories.map(category => (
                    <li 
                      key={category}
                      onClick={() => scrollToCategory(category)}
                      className="cursor-pointer opacity-40 hover:opacity-100 transition-opacity flex items-center gap-3 group"
                    >
                      <div className="w-0 h-[1px] bg-coffee-dark transition-all group-hover:w-4" />
                      {category}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs italic text-coffee-dark/40 uppercase tracking-widest">No categories available</p>
              )}
            </div>

            <div className="bg-coffee-paper p-6 rounded-3xl border border-black/5">
              <Info className="w-4 h-4 text-coffee-accent mb-3" />
              <p className="text-[10px] leading-relaxed text-coffee-dark/60 uppercase tracking-widest font-medium">
                Our menu is updated daily based on selection and seasonal availability.
              </p>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="col-span-12 lg:col-span-9 space-y-16">
          {categories.length > 0 ? categories.map(category => (
            <div 
              key={category} 
              id={`category-${category.replace(/\s+/g, '-').toLowerCase()}`}
              className="space-y-8 scroll-mt-32"
            >
              <div className="flex items-center gap-4">
                <h3 className="font-serif text-2xl text-coffee-dark italic pr-4 bg-coffee-paper z-10">{category}</h3>
                <div className="flex-1 h-[1px] bg-black/5" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {menuItems.filter(item => item.category === category).map((item, index) => (
                  <motion.div 
                    key={item.id ? `${item.id}-${index}` : `menu-item-${category}-${index}`}
                    onClick={() => handleItemClick(item.id)}
                    whileHover={{ x: 4 }}
                    className="flex justify-between items-start border-b border-black/5 pb-6 group cursor-pointer"
                  >
                    <div className="space-y-2">
                      <h4 className="font-serif text-2xl text-coffee-dark group-hover:text-coffee-accent transition-colors leading-none">
                        {item.name}
                      </h4>
                      <p className="text-[10px] opacity-60 uppercase tracking-widest font-bold text-coffee-dark">
                        {item.size || 'Standard'} • {item.calories || 0} Cal
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-serif text-xl text-coffee-dark">${(item.price || 0).toFixed(2)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )) : (
            <div className="py-40 text-center border-2 border-dashed border-black/5 rounded-[40px] bg-white/40">
              <Coffee className="w-12 h-12 text-coffee-dark/20 mx-auto mb-6" />
              <p className="font-serif italic text-2xl text-coffee-dark/50">Our kitchen is currently being updated. Please check back soon.</p>
            </div>
          )}
          
          <div className="mt-20 py-10 border-t border-black/5 text-[10px] uppercase tracking-[0.4em] opacity-30 text-center font-bold">
            UNCLE JOE'S COFFEE & ROASTERY • EST. 1994
          </div>
        </div>
      </div>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-coffee-dark/40 backdrop-blur-sm"
            />
            <motion.div
              layoutId={selectedItem.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white max-w-2xl w-full rounded-[40px] overflow-hidden shadow-2xl border border-black/5 flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 z-10 p-2 bg-coffee-paper rounded-full hover:bg-coffee-accent hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="md:w-1/2 bg-coffee-paper p-8 flex items-center justify-center">
                <img 
                  src={selectedItem.image || `https://picsum.photos/seed/${selectedItem.id}/800/800`} 
                  alt={selectedItem.name}
                  className="w-full h-auto rounded-2xl shadow-xl transform -rotate-3 transition-transform hover:rotate-0"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="md:w-1/2 p-12 space-y-8 flex flex-col justify-center bg-white">
                <div className="space-y-4">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-coffee-accent font-bold">{selectedItem.category}</span>
                  <h2 className="font-serif text-4xl text-coffee-dark leading-tight">{selectedItem.name}</h2>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-medium leading-relaxed italic text-coffee-dark/60">
                    {selectedItem.description || "A hand-crafted signature item from Uncle Joe's kitchen, prepared with only the finest ingredients."}
                  </p>
                  
                  <div className="flex gap-4 border-t border-b border-black/5 py-4">
                    <div className="flex-1 text-center">
                      <span className="text-[8px] uppercase tracking-widest font-bold text-coffee-dark/40 block mb-1">Size</span>
                      <span className="text-xs font-bold uppercase">{selectedItem.size || 'STD'}</span>
                    </div>
                    <div className="w-px h-full bg-black/5" />
                    <div className="flex-1 text-center">
                      <span className="text-[8px] uppercase tracking-widest font-bold text-coffee-dark/40 block mb-1">Calories</span>
                      <span className="text-xs font-bold">{selectedItem.calories || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <span className="font-serif text-3xl text-coffee-dark">${(selectedItem.price || 0).toFixed(2)}</span>
                  <button className="bg-coffee-dark text-white px-8 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-coffee-accent transition-colors flex items-center gap-2 rounded-full">
                    Add to Order <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mini loading for detail view */}
      {loadingDetail && (
        <div className="fixed bottom-10 right-10 z-50 bg-white shadow-2xl p-4 rounded-2xl flex items-center gap-3 border border-black/5">
          <Loader2 className="w-4 h-4 text-coffee-accent animate-spin" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-coffee-accent">Consulting the Chef...</span>
        </div>
      )}
    </div>
  );
}
