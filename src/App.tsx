import { Route, Routes } from "react-router";
import ChatLayout from "./layouts/Chat/ChatLayout";
import HomeLayout from "./layouts/Home/HomeLayout";
import History from "./pages/History";
import Home from "./pages/Home";
import Rates from "./pages/Rates";
import Settings from "./pages/Settings";
import SupportChat from "./pages/SupportChat";

function App() {
  return (
    <Routes>
      <Route element={<HomeLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="rates" element={<Rates />} />
        <Route path="history" element={<History />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route element={<ChatLayout />}>
        <Route path="support" element={<SupportChat />} />
      </Route>
    </Routes>
  );
}

export default App;
