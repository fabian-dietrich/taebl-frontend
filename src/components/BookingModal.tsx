import {
  Modal,
  TextInput,
  Select,
  Textarea,
  Button,
  Group,
  NumberInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useEffect } from "react";
import {
  Table,
  Reservation,
  createReservation,
  updateReservation,
  deleteReservation,
} from "../services/api";
import { TIME_SLOTS, DURATION_OPTIONS, Day } from "../constants";

interface BookingModalProps {
  opened: boolean;
  onClose: () => void;
  tables: Table[];
  reservations: Reservation[];
  reservation?: Reservation;
  preselectedTable?: number;
  preselectedTime?: string;
  currentDay: Day;
  onSuccess: () => void;
}

export function BookingModal({
  opened,
  onClose,
  tables,
  reservations,
  reservation,
  preselectedTable,
  preselectedTime,
  currentDay,
  onSuccess,
}: BookingModalProps) {
  const isEditing = !!reservation;

  const form = useForm({
    initialValues: {
      customerName: "",
      customerPhone: "",
      numberOfGuests: 2,
      tableId: undefined as number | undefined,
      timeSlot: undefined as string | undefined,
      duration: 120,
      specialRequests: "",
    },
    validate: {
      customerName: (value) =>
        value.trim().length > 0 ? null : "Name is required",
      customerPhone: (value) =>
        value.trim().length > 0 ? null : "Phone is required",
      numberOfGuests: (value) =>
        value > 0 ? null : "Must have at least 1 guest",
      tableId: (value) => (value ? null : "Please select a table"),
      timeSlot: (value) => (value ? null : "Please select a time slot"),
    },
  });

  // Update form values when modal opens with different data
  useEffect(() => {
    if (opened) {
      if (reservation) {
        // Editing mode - populate all fields from existing reservation
        form.setValues({
          customerName: reservation.customerName,
          customerPhone: reservation.customerPhone,
          numberOfGuests: reservation.numberOfGuests,
          tableId: reservation.tableId,
          timeSlot: reservation.timeSlot,
          duration: reservation.duration,
          specialRequests: reservation.specialRequests || "",
        });
      } else if (preselectedTable && preselectedTime) {
        // Creating from clicked cell - only prefill table and time
        form.setValues({
          customerName: "",
          customerPhone: "",
          numberOfGuests: 2,
          tableId: preselectedTable,
          timeSlot: preselectedTime,
          duration: 120,
          specialRequests: "",
        });
      } else {
        // Creating from "Add Booking" button - only duration preset
        form.setValues({
          customerName: "",
          customerPhone: "",
          numberOfGuests: 2,
          tableId: undefined,
          timeSlot: undefined,
          duration: 120,
          specialRequests: "",
        });
      }
    }
  }, [opened, reservation, preselectedTable, preselectedTime]);

  // Helper function to check for booking conflicts
  const checkForConflict = (values: typeof form.values): string | null => {
    // Can't check conflict if table or time not selected yet
    if (!values.tableId || !values.timeSlot) {
      return null;
    }

    const startIndex = TIME_SLOTS.indexOf(values.timeSlot);
    const slotsNeeded = Math.ceil(values.duration / 30);
    const endIndex = startIndex + slotsNeeded;

    // Get reservations for the same day and table (excluding current reservation if editing)
    const conflictingReservations = reservations.filter((r) => {
      if (r.day !== currentDay) return false;
      if (r.tableId !== values.tableId) return false;
      if (isEditing && reservation && r.id === reservation.id) return false;
      return true;
    });

    // Check if any existing reservation overlaps with our time range
    for (const existingRes of conflictingReservations) {
      const existingStartIndex = TIME_SLOTS.indexOf(existingRes.timeSlot);
      const existingSlotsOccupied = Math.ceil(existingRes.duration / 30);
      const existingEndIndex = existingStartIndex + existingSlotsOccupied;

      // Check for overlap
      if (startIndex < existingEndIndex && endIndex > existingStartIndex) {
        return `This time slot conflicts with an existing booking for ${existingRes.customerName} at ${existingRes.timeSlot}`;
      }
    }

    return null; // No conflict
  };

  const handleSubmit = async (values: typeof form.values) => {
    // Ensure table and time slot are selected
    if (!values.tableId || !values.timeSlot) {
      notifications.show({
        title: "Missing Information",
        message: "Please select a table and time slot",
        color: "red",
      });
      return;
    }

    // Check for conflicts before submitting
    const conflict = checkForConflict(values);
    if (conflict) {
      notifications.show({
        title: "Booking Conflict",
        message: conflict,
        color: "red",
        autoClose: 5000,
      });
      return;
    }

    try {
      if (isEditing && reservation) {
        await updateReservation(reservation.id, {
          customerName: values.customerName,
          customerPhone: values.customerPhone,
          numberOfGuests: values.numberOfGuests,
          tableId: values.tableId,
          timeSlot: values.timeSlot,
          duration: values.duration,
          specialRequests: values.specialRequests,
          day: currentDay,
        });
        notifications.show({
          title: "Success",
          message: "Reservation updated",
          color: "green",
        });
      } else {
        await createReservation({
          customerName: values.customerName,
          customerPhone: values.customerPhone,
          numberOfGuests: values.numberOfGuests,
          tableId: values.tableId,
          timeSlot: values.timeSlot,
          duration: values.duration,
          specialRequests: values.specialRequests,
          day: currentDay,
        });
        notifications.show({
          title: "Success",
          message: "Reservation created",
          color: "green",
        });
      }
      onSuccess();
      onClose();
      form.reset();
    } catch (error) {
      notifications.show({
        title: "Error",
        message:
          error instanceof Error ? error.message : "Something went wrong",
        color: "red",
      });
    }
  };

  const handleDelete = async () => {
    if (!reservation) return;

    try {
      await deleteReservation(reservation.id);
      notifications.show({
        title: "Success",
        message: "Reservation cancelled",
        color: "blue",
      });
      onSuccess();
      onClose();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to cancel reservation",
        color: "red",
      });
    }
  };

  // Handle modal close - reset form
  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={isEditing ? "Edit Reservation" : "New Reservation"}
      size="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Customer Name"
          placeholder="Jesse Pinkman"
          required
          {...form.getInputProps("customerName")}
          mb="sm"
        />

        <TextInput
          label="Phone Number"
          placeholder="+1 234 567 8900"
          required
          {...form.getInputProps("customerPhone")}
          mb="sm"
        />

        <NumberInput
          label="Number of Guests"
          min={1}
          max={20}
          required
          {...form.getInputProps("numberOfGuests")}
          mb="sm"
        />

        <Select
          label="Table"
          placeholder="Select a table"
          required
          data={tables.map((t) => ({
            value: t.id.toString(),
            label: `Table ${t.tableNumber} (${t.capacity} seats)`,
          }))}
          {...form.getInputProps("tableId")}
          onChange={(value) =>
            form.setFieldValue("tableId", value ? Number(value) : undefined)
          }
          value={form.values.tableId?.toString() || null}
          mb="sm"
        />

        <Select
          label="Time Slot"
          placeholder="Select a time slot"
          required
          data={TIME_SLOTS}
          {...form.getInputProps("timeSlot")}
          value={form.values.timeSlot || null}
          mb="sm"
        />

        <Select
          label="Duration"
          required
          data={DURATION_OPTIONS}
          {...form.getInputProps("duration")}
          onChange={(value) => form.setFieldValue("duration", Number(value))}
          value={form.values.duration.toString()}
          mb="sm"
        />

        <Textarea
          label="Special Requests"
          placeholder="Allergies, preferences, etc."
          {...form.getInputProps("specialRequests")}
          mb="lg"
        />

        <Group justify="space-between">
          {isEditing && (
            <Button color="red" variant="outline" onClick={handleDelete}>
              Cancel Booking
            </Button>
          )}
          <Group ml="auto">
            <Button variant="subtle" onClick={handleClose}>
              Close
            </Button>
            <Button type="submit">
              {isEditing ? "Update" : "Create"} Booking
            </Button>
          </Group>
        </Group>
      </form>
    </Modal>
  );
}
