import { Toaster } from "@/components/ui/sonner";
import RouterOutlet from "./components/global/RouterOutlet";

function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <RouterOutlet />
    </>
  );
}

export default App;
