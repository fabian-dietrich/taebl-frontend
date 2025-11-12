import { Table, ScrollArea, Box, Text } from '@mantine/core';
import { Table as TableType, Reservation } from '../services/api';
import { TIME_SLOTS, Day } from '../constants';

interface ScheduleGridProps {
  tables: TableType[];
  reservations: Reservation[];
  currentDay: Day;
  onCellClick: (tableId: number, timeSlot: string, reservation?: Reservation) => void;
}

export function ScheduleGrid({ tables, reservations, currentDay, onCellClick }: ScheduleGridProps) {
  // Filter reservations for current day
  const dayReservations = reservations.filter(r => r.day === currentDay);

  // Helper: Check if a cell is occupied
  const getCellReservation = (tableId: number, timeSlot: string): Reservation | undefined => {
    return dayReservations.find(r => {
      if (r.tableId !== tableId) return false;
      
      // Calculate which time slots this reservation occupies
      const startIndex = TIME_SLOTS.indexOf(r.timeSlot);
      const slotsOccupied = Math.ceil(r.duration / 30);
      const endIndex = startIndex + slotsOccupied;
      const currentIndex = TIME_SLOTS.indexOf(timeSlot);
      
      return currentIndex >= startIndex && currentIndex < endIndex;
    });
  };

  // Helper: Check if this is the first cell of a reservation
  const isReservationStart = (reservation: Reservation, timeSlot: string): boolean => {
    return reservation.timeSlot === timeSlot;
  };

  return (
    <ScrollArea style={{ height: 'calc(100vh - 80px)' }}>
      <Table
        striped
        highlightOnHover
        withTableBorder
        withColumnBorders
        style={{ minWidth: '800px' }}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th
              style={{
                position: 'sticky',
                left: 0,
                backgroundColor: 'white',
                zIndex: 1,
                minWidth: '150px',
              }}
            >
              Table
            </Table.Th>
            {TIME_SLOTS.map((slot) => (
              <Table.Th key={slot} style={{ minWidth: '100px', textAlign: 'center' }}>
                {slot}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {tables
            .sort((a, b) => a.id - b.id) // Sort by ID
            .map((table) => (
              <Table.Tr key={table.id}>
                {/* Table info - sticky column */}
                <Table.Td
                  style={{
                    position: 'sticky',
                    left: 0,
                    backgroundColor: 'white',
                    zIndex: 1,
                    fontWeight: 600,
                  }}
                >
                  <div>
                    <Text size="sm">Table {table.tableNumber}</Text>
                    <Text size="xs" c="dimmed">
                      {table.capacity} seats
                    </Text>
                  </div>
                </Table.Td>

                {/* Time slot cells */}
                {TIME_SLOTS.map((timeSlot) => {
                  const reservation = getCellReservation(table.id, timeSlot);
                  const isEmpty = !reservation;
                  const isStart = reservation && isReservationStart(reservation, timeSlot);

                  return (
                    <Table.Td
                      key={timeSlot}
                      onClick={() => onCellClick(table.id, timeSlot, reservation)}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: isEmpty ? '#e7f5e7' : '#d0e7ff',
                        textAlign: 'center',
                        padding: '8px',
                        position: 'relative',
                      }}
                    >
                      {isStart && reservation && (
                        <Box>
                          <Text size="xs" fw={600}>
                            {reservation.customerName}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {reservation.numberOfGuests}p
                          </Text>
                        </Box>
                      )}
                      {!isStart && reservation && (
                        <Box style={{ opacity: 0.5 }}>
                          <Text size="xs">•••</Text>
                        </Box>
                      )}
                    </Table.Td>
                  );
                })}
              </Table.Tr>
            ))}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
