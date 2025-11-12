import { useEffect, useState } from 'react';
import { Container, Title, Text, Paper, Stack, Group, Loader } from '@mantine/core';
import { fetchTables, fetchReservations, Table, Reservation } from '../services/api';

export function DataDisplay() {
  const [tables, setTables] = useState<Table[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [tablesData, reservationsData] = await Promise.all([
          fetchTables(),
          fetchReservations(),
        ]);
        setTables(tablesData);
        setReservations(reservationsData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Container size="lg" py="xl">
        <Stack align="center">
          <Loader size="xl" />
          <Text>Loading data from backend...</Text>
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="lg" py="xl">
        <Paper p="xl" withBorder style={{ borderColor: 'red' }}>
          <Text c="red" fw={700}>Error: {error}</Text>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <Title order={1}>Backend Connection Test</Title>
        <Text size="lg" c="dimmed">
          🔌 connected to: https://taebl-backend.onrender.com/api
        </Text>

        {/* Tables*/}
        <div>
          <Title order={2} mb="md">Tables ({tables.length})</Title>
          <Stack gap="md">
            {tables.map((table) => (
              <Paper key={table.id} p="md" withBorder>
                <Group justify="space-between">
                  <div>
                    <Text fw={700}>Table {table.tableNumber}</Text>
                    <Text size="sm" c="dimmed">
                      Capacity: {table.capacity} people
                    </Text>
                  </div>
                </Group>
              </Paper>
            ))}
          </Stack>
        </div>

        {/* Reservations */}
        <div>
          <Title order={2} mb="md">Reservations ({reservations.length})</Title>
          <Stack gap="md">
            {reservations.map((reservation) => (
              <Paper key={reservation.id} p="md" withBorder>
                <Group justify="space-between" mb="xs">
                  <Text fw={700}>{reservation.customerName}</Text>
                </Group>
                <Text size="sm">
                 {reservation.numberOfGuests} guests – {reservation.day}, {reservation.timeSlot} – Table {reservation.tableId}
                </Text>
                {reservation.specialRequests && (
                  <Text size="sm" c="dimmed" mt="xs">
                    Note: {reservation.specialRequests}
                  </Text>
                )}
              </Paper>
            ))}
          </Stack>
        </div>
      </Stack>
    </Container>
  );
}
