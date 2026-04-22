export interface Location {
  raw: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  size: string;
  calories: number;
  price: number;
  description?: string;
  image?: string;
}

export interface GuestUser {
  name: string;
  signInTime: number;
}
