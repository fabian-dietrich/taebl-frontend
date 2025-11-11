// API Base URL - your Render backend
const API_BASE_URL = 'https://taebl-backend.onrender.com/api';

// TypeScript interfaces for your data
export interface Table {
  id: number;
  tableNumber: string;
  capacity: number;
  location: string;
  createdAt: string;
}

export interface Reservation {
  id: number;
  customerName: string;
  customerPhone: string;
  numberOfGuests: number;
  timeSlot: string;
  date: string;
  specialRequests: string | null;
  tableId: number;
  status: string;
  createdAt: string;
}

// Fetch all tables
export const fetchTables = async (): Promise<Table[]> => {
  const response = await fetch(`${API_BASE_URL}/tables`);
  if (!response.ok) {
    throw new Error('Failed to fetch tables');
  }
  return response.json();
};

// Fetch all reservations
export const fetchReservations = async (): Promise<Reservation[]> => {
  const response = await fetch(`${API_BASE_URL}/reservations`);
  if (!response.ok) {
    throw new Error('Failed to fetch reservations');
  }
  return response.json();
};
