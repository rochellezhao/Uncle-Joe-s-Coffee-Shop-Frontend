import { User } from '../types';

const BASE_URL = 'https://uncle-joes-api-24755618771.us-central1.run.app';

let authToken: string | null = localStorage.getItem('auth_token');

/**
 * Universal helper to extract data from various API response shapes
 */
const extractArray = (data: any, keyHint: string): any[] => {
  if (Array.isArray(data)) return data;
  if (!data) return [];
  
  const keys = [keyHint, 'data', 'items', 'list', 'results', 'locations', 'orders', 'history', 'payload', 'content'];
  for (const key of keys) {
    if (data[key] && Array.isArray(data[key])) return data[key];
  }
  
  const firstArrayKey = Object.keys(data).find(k => Array.isArray(data[k]));
  if (firstArrayKey) return data[firstArrayKey];

  return [];
};

const getHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};

export const coffeeApi = {
  setToken(token: string | null) {
    authToken = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  },

  async login(email: string, password: string): Promise<any> {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json().catch(() => ({}));
    console.log("RAW LOGIN RESPONSE:", data);
    return data;
  },

  async getOrders(): Promise<any[]> {
    try {
      const saved = localStorage.getItem('app_user');
      if (!saved) return [];
      const currentUser = JSON.parse(saved);
      
      console.log("CURRENT USER SESSION:", currentUser);
      
      const resolvedMemberId = currentUser.member_id || currentUser.id;
      console.log("MEMBER ID (PERSON ID) FROM LOGIN:", resolvedMemberId);

      if (!resolvedMemberId) {
        console.warn("No Person ID resolved for fetching history.");
        return [];
      }
      
      const endpoints = [
        `${BASE_URL}/orders/person/${resolvedMemberId}`,
        `${BASE_URL}/orders/member/${resolvedMemberId}`,
        `${BASE_URL}/members/${resolvedMemberId}/history`,
        `${BASE_URL}/persons/${resolvedMemberId}/history`,
        `${BASE_URL}/order-history?member_id=${resolvedMemberId}`,
        `${BASE_URL}/order-history?person_id=${resolvedMemberId}`
      ];

      for (const url of endpoints) {
        if (url.includes('undefined') || url.includes('null')) continue;
        console.log("ORDER HISTORY REQUEST URL:", url);
        
        try {
          const response = await fetch(url, { headers: getHeaders() });
          if (response.ok) {
            const data = await response.json();
            console.log("RAW ORDER HISTORY RESPONSE:", data);

            let orders: any[] = [];
            if (Array.isArray(data)) {
              orders = data;
            } else if (data) {
              const keys = ['orders', 'items', 'history', 'order_history', 'person_orders', 'data', 'past_orders'];
              for (const key of keys) {
                if (data[key] && Array.isArray(data[key])) {
                  orders = data[key];
                  break;
                }
              }
            }

            console.log("PARSED ORDER HISTORY:", orders);
            if (orders && orders.length > 0) return orders;
          }
        } catch (e) {
          // next
        }
      }
      
      return [];
    } catch (err) {
      return [];
    }
  },

  async getLocations(): Promise<string[]> {
    try {
      const response = await fetch(`${BASE_URL}/locations`, {
        headers: getHeaders(),
      });
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
      const response = await fetch(`${BASE_URL}/menu`, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return extractArray(data, 'menu');
    } catch (err) {
      return [];
    }
  },

  async getMenuItemById(id: string): Promise<any | null> {
    try {
      const response = await fetch(`${BASE_URL}/menu/${id}`, {
        headers: getHeaders(),
      });
      if (!response.ok) return null;
      const data = await response.json();
      return data.data || data.menu || data.item || data;
    } catch (err) {
      return null;
    }
  }
};
