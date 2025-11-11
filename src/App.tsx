import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { DataDisplay } from "./components/DataDisplay";

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <DataDisplay />
    </MantineProvider>
  );
}
