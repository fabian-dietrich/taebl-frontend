import { useState, useEffect } from 'react';
import { Box, Loader, Center, Text } from '@mantine/core';
import { fetchTables, fetchReservations, Table, Reservation } from '../services/api';
import { Navbar } from './Navbar';
import { ScheduleGrid } from './ScheduleGrid';
import { BookingModal } from './BookingModal';
import { Day } from '../constants';

export function BookingInterface() {
  const [tables, setTables] = useState<Table[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDay, setCurrentDay] = useState<Day>('today');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | undefined>();
  const [selectedTable, setSelectedTable] = useState<number | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();

  const loadData = async () => {
    try {
      setLoading(true);
      const [tablesData, reservationsData] = await Promise.all([
        fetchTables(),
        fetchReservations(),
      ]);
      setTables(tablesData);
      setReservations(reservationsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddBooking = () => {
    setSelectedReservation(undefined);
    setSelectedTable(undefined);
    setSelectedTime(undefined);
    setModalOpen(true);
  };

  const handleCellClick = (tableId: number, timeSlot: string, reservation?: Reservation) => {
    if (reservation) {
      // Clicking occupied cell - edit existing reservation
      setSelectedReservation(reservation);
      setSelectedTable(undefined);
      setSelectedTime(undefined);
    } else {
      // Clicking empty cell - create new reservation
      setSelectedReservation(undefined);
      setSelectedTable(tableId);
      setSelectedTime(timeSlot);
    }
    setModalOpen(true);
  };

  const handleModalSuccess = () => {
    loadData(); // Refresh data after any change
  };

  if (loading) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader size="xl" />
      </Center>
    );
  }

  return (
    <Box style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        currentDay={currentDay}
        onDayChange={setCurrentDay}
        onAddBooking={handleAddBooking}
      />

      <Box style={{ flex: 1, overflow: 'hidden' }}>
        {reservations.length === 0 && tables.length === 0 ? (
          <Center style={{ height: '100%' }}>
            <Text c="dimmed">No data available</Text>
          </Center>
        ) : (
          <ScheduleGrid
            tables={tables}
            reservations={reservations}
            currentDay={currentDay}
            onCellClick={handleCellClick}
          />
        )}
      </Box>

      <BookingModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        tables={tables}
        reservations={reservations}
        reservation={selectedReservation}
        preselectedTable={selectedTable}
        preselectedTime={selectedTime}
        currentDay={currentDay}
        onSuccess={handleModalSuccess}
      />
    </Box>
  );
}
