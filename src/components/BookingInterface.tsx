import { useEffect } from "react";
import { Box, Loader, Center, Text } from "@mantine/core";
import { Reservation } from "../services/api";
import { useDemoState } from "../hooks/useDemoState";
import { Navbar } from "./Navbar";
import { ScheduleGrid } from "./ScheduleGrid";
import { BookingModal } from "./BookingModal";
import { Day } from "../constants";
import { useState } from "react";

export function BookingInterface() {
  const {
    tables,
    reservations,
    loading,
    loadData,
    createReservation,
    updateReservation,
    deleteReservation,
  } = useDemoState();

  const [currentDay, setCurrentDay] = useState<Day>("today");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<
    Reservation | undefined
  >();
  const [selectedTable, setSelectedTable] = useState<number | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddBooking = () => {
    setSelectedReservation(undefined);
    setSelectedTable(undefined);
    setSelectedTime(undefined);
    setModalOpen(true);
  };

  const handleCellClick = (
    tableId: number,
    timeSlot: string,
    reservation?: Reservation
  ) => {
    if (reservation) {
      setSelectedReservation(reservation);
      setSelectedTable(undefined);
      setSelectedTime(undefined);
    } else {
      setSelectedReservation(undefined);
      setSelectedTable(tableId);
      setSelectedTime(timeSlot);
    }
    setModalOpen(true);
  };

  const handleModalSuccess = () => {
    // No-op in demo mode — state is already updated locally
  };

  if (loading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="xl" />
      </Center>
    );
  }

  return (
    <Box style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar
        currentDay={currentDay}
        onDayChange={setCurrentDay}
        onAddBooking={handleAddBooking}
      />

      <Box style={{ flex: 1, overflow: "hidden" }}>
        {reservations.length === 0 && tables.length === 0 ? (
          <Center style={{ height: "100%" }}>
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
        demoCreate={createReservation}
        demoUpdate={updateReservation}
        demoDelete={deleteReservation}
      />
    </Box>
  );
}