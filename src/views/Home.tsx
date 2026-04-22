import { motion } from 'motion/react';
import { ArrowRight, Coffee, Leaf, MapPin } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: any) => void;
  guestName?: string;
}

export default function Home({ onNavigate, guestName }: HomeProps) {
  return (
    <div className="px-12 py-10 space-y-24 pb-32">
      <div className="grid grid-cols-12 gap-8 h-full min-h-[600px]">
        {/* Left Content */}
        <div className="col-span-12 lg:col-span-7 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {guestName && (
              <span className="text-[10px] uppercase tracking-[0.3em] text-coffee-accent font-bold mb-4 block">
                Welcome back, {guestName}
              </span>
            )}
            <h2 className="font-serif text-7xl leading-[1.1] mb-6 text-coffee-dark">
              Slow roasted.<br />
              <span className="italic font-normal">Fast friends.</span>
            </h2>
            <p className="text-lg opacity-80 leading-relaxed max-w-md text-coffee-dark">
              From the hills of Ethiopia to the heart of the city, Uncle Joe brings you a ritual, not just a caffeine kick.
            </p>
            
            <div className="mt-10 flex gap-4">
              <button 
                onClick={() => onNavigate('menu')}
                className="bg-coffee-dark text-white px-8 py-4 text-xs uppercase tracking-widest hover:bg-coffee-accent transition-colors"
              >
                Explore Menu
              </button>
              <button 
                onClick={() => onNavigate('locations')}
                className="border border-black/20 px-8 py-4 text-xs uppercase tracking-widest hover:border-black/40 transition-colors"
              >
                Find Us
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Visual */}
        <div className="col-span-12 lg:col-span-5 relative bg-[#D9D1C7] flex items-center justify-center overflow-hidden rounded-[40px] min-h-[500px]">
          <div className="absolute inset-0 z-0 opacity-70">
            <img 
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2000" 
              alt="Roasted Coffee Beans Texture" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-tr from-coffee-dark/80 via-coffee-dark/30 to-transparent z-1"></div>
          
          <motion.div 
            initial={{ opacity: 0, rotate: 0, scale: 0.8 }}
            animate={{ opacity: 1, rotate: -3, scale: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="z-10 bg-white p-4 shadow-2xl border border-black/5 rounded-lg"
          >
            <div className="w-64 h-80 bg-coffee-paper mb-4 overflow-hidden rounded-md">
              <img 
                src="https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=800" 
                alt="A Fresh Cup of Black Coffee" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="font-serif italic text-center text-coffee-dark tracking-wide">The Daily Brew</p>
          </motion.div>
        </div>
      </div>

      {/* Aesthetic Gallery Section */}
      <section className="space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/5 pb-10">
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-coffee-accent">Aesthetically Roasted</span>
            <h3 className="font-serif text-5xl text-coffee-dark leading-tight">The Art of the Bean</h3>
          </div>
          <p className="text-xs uppercase tracking-[0.2em] font-medium text-coffee-dark/40 max-w-xs leading-relaxed">
            From raw soil to your morning ritual. We source, roast, and brew for the perfect cup.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800', 
              label: 'Selected Beans', 
              desc: 'Premium roasted beans from ethical farms.' 
            },
            { 
              image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800', 
              label: 'Master Roasting', 
              desc: 'Small batches, intense flavor, rich aroma.' 
            },
            { 
              image: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?q=80&w=800', 
              label: 'Pure Tea Ritual', 
              desc: 'High-mountain loose leaf botanical blends.' 
            }
          ].map((item, i) => (
            <motion.div 
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="space-y-6 group"
            >
              <div className="aspect-[4/5] bg-coffee-paper overflow-hidden rounded-[32px] border border-black/5">
                <img 
                  src={item.image} 
                  alt={item.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-2">
                <h4 className="font-serif text-2xl text-coffee-dark">{item.label}</h4>
                <p className="text-xs uppercase tracking-widest text-coffee-dark/50 font-bold">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Decorative Quote */}
      <section className="py-20 flex flex-col items-center text-center space-y-10">
        <div className="w-12 h-[1px] bg-coffee-accent opacity-30" />
        <blockquote className="font-serif text-4xl md:text-6xl text-coffee-dark px-4 leading-tight italic">
          "Coffee is a language in itself."
        </blockquote>
      </section>

      {/* Extreme Close-up Beans Section */}
      <section className="relative h-[60vh] rounded-[40px] overflow-hidden group">
        <img 
          src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=2000" 
          alt="Coffee Beans Detail" 
          className="w-full h-full object-cover transition-transform duration-[20s] group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center space-y-4 px-6">
            <h3 className="font-serif text-4xl md:text-7xl text-white">Small Batch. Big Soul.</h3>
            <p className="text-white/80 uppercase tracking-[0.4em] text-xs font-bold">Every bean tells a story from soil to cup.</p>
          </div>
        </div>
      </section>

      {/* Global Sourcing Decorative Footer */}
      <section className="py-10 flex items-center justify-center gap-4 text-[10px] uppercase tracking-[0.4em] font-bold text-coffee-dark/30">
        <span>ETHIOPIA</span>
        <div className="w-1 h-1 bg-coffee-accent rounded-full" />
        <span>INDONESIA</span>
        <div className="w-1 h-1 bg-coffee-accent rounded-full" />
        <span>COLOMBIA</span>
      </section>
    </div>
  );
}
