import RouterOutlet from "./components/global/RouterOutlet";
import { Toaster } from "./components/global/Sonner";

function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <RouterOutlet />
    </>
  );
}

export default App;
