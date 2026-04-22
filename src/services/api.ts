const BASE_URL = 'https://uncle-joes-api-24755618771.us-central1.run.app';

/**
 * Universal helper to extract data from various API response shapes
 */
const extractArray = (data: any, keyHint: string): any[] => {
  if (Array.isArray(data)) return data;
  if (!data) return [];
  
  const keys = [keyHint, 'data', 'items', 'list', 'results', 'locations'];
  for (const key of keys) {
    if (data[key] && Array.isArray(data[key])) return data[key];
  }
  
  const firstArrayKey = Object.keys(data).find(k => Array.isArray(data[k]));
  if (firstArrayKey) return data[firstArrayKey];

  return [];
};

export const coffeeApi = {
  async getLocations(): Promise<string[]> {
    try {
      const response = await fetch(`${BASE_URL}/locations`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      
      console.log("RAW LOCATIONS RESPONSE:", data);
      
      const extractedLocations = extractArray(data, 'locations');
      console.log("EXTRACTED LOCATIONS ARRAY:", extractedLocations);
      
      return extractedLocations;
    } catch (err) {
      console.error('Error in getLocations:', err);
      return [];
    }
  },

  async getMenu(): Promise<any[]> {
    try {
      const response = await fetch(`${BASE_URL}/menu`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return extractArray(data, 'menu');
    } catch (err) {
      return [];
    }
  },

  async getMenuItemById(id: string): Promise<any | null> {
    try {
      const response = await fetch(`${BASE_URL}/menu/${id}`);
      if (!response.ok) return null;
      const data = await response.json();
      return data.data || data.menu || data.item || data;
    } catch (err) {
      return null;
    }
  }
};
