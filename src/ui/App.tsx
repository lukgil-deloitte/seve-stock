import "./App.css";
import { QueryClient, QueryClientProvider, } from "@tanstack/react-query";
import { MainFrame } from "./components/MainFrame";

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainFrame />
    </QueryClientProvider>
  );
}

