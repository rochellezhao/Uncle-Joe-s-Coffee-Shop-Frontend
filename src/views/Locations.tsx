import { useEffect, useState, useMemo } from 'react';
import { coffeeApi } from '../services/api';
import { matchAndEnrich, RawCSVRow } from '../services/locationEnricher';
import { LOCATIONS_CSV_DATA } from '../data/locationsConstants';
import { motion } from 'motion/react';
import { Loader2, Search, X } from 'lucide-react';

interface EnrichedLocation {
  city: string;
  state: string;
  address: string;
  raw: string;
  hours: {
    Mon: string;
    Tue: string;
    Wed: string;
    Thu: string;
    Fri: string;
    Sat: string;
    Sun: string;
  } | null;
}

const STATE_NAMES: Record<string, string> = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
  'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
  'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
  'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
  'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
  'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
  'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
  'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming'
};

export default function Locations() {
  const [enrichedLocations, setEnrichedLocations] = useState<EnrichedLocation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndEnrich = async () => {
      try {
        setLoading(true);
        
        const lines = LOCATIONS_CSV_DATA.split('\n');
        const headers = lines[0].split(',');
        const csvRows: RawCSVRow[] = lines.slice(1).filter(line => line.trim()).map(line => {
          const values = line.split(',');
          const obj: any = {};
          headers.forEach((header, i) => {
            obj[header] = values[i];
          });
          return obj as RawCSVRow;
        });

        const apiStrings = await coffeeApi.getLocations();
        const enriched = apiStrings.map(str => {
          const result = matchAndEnrich(str, csvRows);
          return { ...result, raw: str } as EnrichedLocation;
        }).filter(loc => loc.city && loc.state);

        setEnrichedLocations(enriched);
        setError(null);
      } catch (err) {
        console.error('Logic Error:', err);
        setError('Failed to process location data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAndEnrich();
  }, []);

  const filteredAndGrouped = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    // 1. Filter based on query
    const filtered = enrichedLocations.filter(loc => {
      if (!query) return true;
      const stateName = STATE_NAMES[loc.state.toUpperCase()] || '';
      return (
        loc.city.toLowerCase().includes(query) ||
        loc.state.toLowerCase().includes(query) ||
        stateName.toLowerCase().includes(query)
      );
    });

    // 2. Group by state
    const grouped = filtered.reduce((acc, loc) => {
      if (!acc[loc.state]) acc[loc.state] = [];
      acc[loc.state].push(loc);
      return acc;
    }, {} as Record<string, EnrichedLocation[]>);

    // 3. Sort keys and cities
    const sortedKeys = Object.keys(grouped).sort();
    const finalGrouped: Record<string, EnrichedLocation[]> = {};
    sortedKeys.forEach(state => {
      finalGrouped[state] = grouped[state].sort((a, b) => a.city.localeCompare(b.city));
    });

    return finalGrouped;
  }, [enrichedLocations, searchQuery]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 text-coffee-accent animate-spin" />
        <p className="text-coffee-dark/40 font-mono text-xs uppercase tracking-widest text-center">
          Searching for roasteries...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-red-500 font-mono text-sm uppercase tracking-tight p-12 text-center">
        Error: {error}
      </div>
    );
  }

  const stateKeys = Object.keys(filteredAndGrouped);

  return (
    <div className="max-w-xl mx-auto px-6 py-20 min-h-screen selection:bg-coffee-accent/20">
      <header className="mb-12 text-center space-y-4">
        <span className="text-[10px] uppercase tracking-[0.4em] text-coffee-accent font-bold">Comprehensive Directory</span>
        <h1 className="font-serif text-5xl text-coffee-dark tracking-tight">Our Roasteries</h1>
      </header>

      {/* Search Interaction */}
      <div className="mb-20 relative group">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-coffee-dark/20 group-focus-within:text-coffee-accent transition-colors" />
        </div>
        <input 
          type="text"
          placeholder="Search by city, state (e.g. FL, Florida)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/50 border border-coffee-dark/5 rounded-2xl py-4 pl-14 pr-12 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-coffee-accent/10 focus:bg-white transition-all placeholder:text-coffee-dark/20 shadow-sm"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-6 flex items-center text-coffee-dark/20 hover:text-coffee-dark transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-24">
        {stateKeys.length > 0 ? (
          stateKeys.map(state => (
            <section key={state} className="space-y-8">
              <div className="flex items-baseline gap-4 border-b border-coffee-dark/5 pb-2">
                <h2 className="font-serif text-3xl text-coffee-dark/80">{state}</h2>
                <span className="text-[10px] uppercase tracking-widest font-bold text-coffee-dark/20">{STATE_NAMES[state.toUpperCase()]}</span>
                <div className="flex-1" />
              </div>

              <div className="grid grid-cols-1 gap-1">
                {filteredAndGrouped[state].map((loc) => (
                  <motion.div 
                    key={`${state}-${loc.city}-${loc.address}-${loc.raw}`}
                    whileHover={{ x: 4 }}
                    className="group py-6 px-6 rounded-2xl transition-all hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-transparent hover:border-coffee-dark/5"
                  >
                    <div className="space-y-4">
                      <div>
                        <div className="font-bold text-coffee-dark group-hover:text-coffee-accent transition-colors text-lg">
                          {loc.city}
                        </div>
                        <div className="text-xs text-coffee-dark/40 font-medium lowercase tracking-wider">
                          {loc.address}
                        </div>
                      </div>

                      {loc.hours ? (
                        <div className="pt-2 border-t border-coffee-dark/5">
                          <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-coffee-accent mb-2">Weekly Hours</div>
                          <div className="grid grid-cols-1 gap-0.5 text-[10px] uppercase tracking-widest font-bold opacity-60">
                            <div className="flex justify-between max-w-[220px]"><span>Monday</span><span>{loc.hours.Mon}</span></div>
                            <div className="flex justify-between max-w-[220px]"><span>Tuesday</span><span>{loc.hours.Tue}</span></div>
                            <div className="flex justify-between max-w-[220px]"><span>Wednesday</span><span>{loc.hours.Wed}</span></div>
                            <div className="flex justify-between max-w-[220px]"><span>Thursday</span><span>{loc.hours.Thu}</span></div>
                            <div className="flex justify-between max-w-[220px]"><span>Friday</span><span>{loc.hours.Fri}</span></div>
                            <div className="flex justify-between max-w-[220px]"><span>Saturday</span><span>{loc.hours.Sat}</span></div>
                            <div className="flex justify-between max-w-[220px]"><span>Sunday</span><span>{loc.hours.Sun}</span></div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-[10px] uppercase tracking-widest font-bold text-red-400/60 italic pt-2">
                          Hours unavailable
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="py-20 text-center space-y-4">
            <p className="font-serif italic text-2xl text-coffee-dark/30">No matching locations found.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="text-[10px] uppercase tracking-widest font-bold text-coffee-accent hover:underline"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
