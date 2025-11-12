import { Group, Button, SegmentedControl, Box } from '@mantine/core';
import { Day } from '../constants';

interface NavbarProps {
  currentDay: Day;
  onDayChange: (day: Day) => void;
  onAddBooking: () => void;
}

export function Navbar({ currentDay, onDayChange, onAddBooking }: NavbarProps) {
  return (
    <Box
      style={{
        borderBottom: '1px solid #e0e0e0',
        padding: '1rem 2rem',
        backgroundColor: 'white',
      }}
    >
      <Group justify="space-between">
        <Box style={{ fontSize: '1.5rem', fontWeight: 700 }}>
          🍽️ taebl
        </Box>

        <Group gap="md">
          <SegmentedControl
            value={currentDay}
            onChange={(value) => onDayChange(value as Day)}
            data={[
              { label: 'Today', value: 'today' },
              { label: 'Tomorrow', value: 'tomorrow' },
            ]}
          />

          <Button onClick={onAddBooking}>
            + Add Booking
          </Button>
        </Group>
      </Group>
    </Box>
  );
}
