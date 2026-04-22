export interface RawCSVRow {
  city: string;
  state: string;
  address_one: string;
  address_two: string;
  zip_code: string;
  location_map_address: string;
  hours_monday_open: string;
  hours_monday_close: string;
  hours_tuesday_open: string;
  hours_tuesday_close: string;
  hours_wednesday_open: string;
  hours_wednesday_close: string;
  hours_thursday_open: string;
  hours_thursday_close: string;
  hours_friday_open: string;
  hours_friday_close: string;
  hours_saturday_open: string;
  hours_saturday_close: string;
  hours_sunday_open: string;
  hours_sunday_close: string;
}

/**
 * Normalizes a string for robust comparison
 */
const normalize = (str: string) => {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
};

const formatTime = (time: string) => {
  if (!time || time === '0' || time === '') return null;
  let t = String(time).padStart(4, '0');
  let h = parseInt(t.substring(0, 2));
  const m = t.substring(2);
  const suffix = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${suffix}`;
};

const getDayHours = (open: string, close: string) => {
  const o = formatTime(open);
  const c = formatTime(close);
  return (o && c) ? `${o} - ${c}` : 'Closed';
};

export const matchAndEnrich = (apiString: string, csvRows: RawCSVRow[]) => {
  const normalizedApi = normalize(apiString);
  
  // Try to find a match where the API string contains key address components
  const match = csvRows.find(row => {
    // Primary match: check if the map address matches the start/end of the API string
    const mapAddr = normalize(row.location_map_address);
    if (mapAddr && (normalizedApi.includes(mapAddr) || mapAddr.includes(normalizedApi))) return true;

    // Secondary match: check if City/State/Zip matches
    const cityStateZip = normalize(`${row.city}${row.state}${row.zip_code}`);
    return normalizedApi.includes(cityStateZip);
  });

  if (match) {
    return {
      city: match.city,
      state: match.state,
      address: [match.address_one, match.address_two].filter(Boolean).join(', '),
      hours: {
        Mon: getDayHours(match.hours_monday_open, match.hours_monday_close),
        Tue: getDayHours(match.hours_tuesday_open, match.hours_tuesday_close),
        Wed: getDayHours(match.hours_wednesday_open, match.hours_wednesday_close),
        Thu: getDayHours(match.hours_thursday_open, match.hours_thursday_close),
        Fri: getDayHours(match.hours_friday_open, match.hours_friday_close),
        Sat: getDayHours(match.hours_saturday_open, match.hours_saturday_close),
        Sun: getDayHours(match.hours_sunday_open, match.hours_sunday_close),
      }
    };
  }

  // Fallback parsing if no match
  const parts = apiString.split(' ');
  const zip = parts.pop() || '';
  const state = parts.pop() || '';
  const city = parts.pop() || '';
  const address = parts.join(' ');

  return {
    city,
    state,
    address,
    hours: null
  };
};
