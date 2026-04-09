import { useState, useCallback } from "react";
import {
  Table,
  Reservation,
  fetchTables,
  fetchReservations,
} from "../services/api";

// Counter for generating fake IDs in demo mode
let nextDemoId = 10000;

export function useDemoState() {
  const [tables, setTables] = useState<Table[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial load — fetch real seed data from the API
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [tablesData, reservationsData] = await Promise.all([
        fetchTables(),
        fetchReservations(),
      ]);
      setTables(tablesData);
      setReservations(reservationsData);
    } catch (error) {
      console.error("Failed to load seed data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create — add to local state only
  const createReservation = useCallback(
    (data: Omit<Reservation, "id" | "createdAt" | "status">) => {
      const newReservation: Reservation = {
        ...data,
        id: nextDemoId++,
        status: "Booked",
        createdAt: new Date().toISOString(),
      };
      setReservations((prev) => [...prev, newReservation]);
      return newReservation;
    },
    []
  );

  // Update — patch in local state only
  const updateReservation = useCallback(
    (id: number, data: Partial<Reservation>) => {
      let updated: Reservation | null = null;
      setReservations((prev) =>
        prev.map((r) => {
          if (r.id === id) {
            updated = { ...r, ...data };
            return updated;
          }
          return r;
        })
      );
      return updated as Reservation | null;
    },
    []
  );

  // Delete — remove from local state only
  const deleteReservation = useCallback((id: number) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return {
    tables,
    reservations,
    loading,
    loadData,
    createReservation,
    updateReservation,
    deleteReservation,
  };
}
