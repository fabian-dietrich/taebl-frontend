// const API_BASE_URL = "https://taebl-backend.onrender.com/api";
const API_BASE_URL = "http://localhost:5005/api"; // Temporary: using local backend

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
  day: string; // today or tomorrow
  duration: number;
  specialRequests: string | null;
  tableId: number;
  status: string;
  createdAt: string;
}

// get all tables
export const fetchTables = async (): Promise<Table[]> => {
  const response = await fetch(`${API_BASE_URL}/tables`);
  if (!response.ok) {
    throw new Error("Failed to fetch tables");
  }
  return response.json();
};

// get all reservations
export const fetchReservations = async (): Promise<Reservation[]> => {
  const response = await fetch(`${API_BASE_URL}/reservations`);
  if (!response.ok) {
    throw new Error("Failed to fetch reservations");
  }
  return response.json();
};

// create new reservation
export const createReservation = async (
  data: Omit<Reservation, "id" | "createdAt" | "status">
): Promise<Reservation> => {
  const response = await fetch(`${API_BASE_URL}/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create reservation");
  }
  return response.json();
};

// update reservation
export const updateReservation = async (
  id: number,
  data: Partial<Reservation>
): Promise<Reservation> => {
  const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update reservation");
  }
  return response.json();
};

// delete reservation
export const deleteReservation = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete reservation");
  }
};
