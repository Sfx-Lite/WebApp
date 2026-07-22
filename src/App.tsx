import { Route, Routes } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import Login from "./components/Onboarding/Login";

import Pin from "./components/Onboarding/Pin";
import Register from "./components/Onboarding/Register";

import Welcome from "./components/Onboarding/Welcome";
import ChatLayout from "./layouts/Chat/ChatLayout";
import HomeLayout from "./layouts/Home/HomeLayout";
import OnboardingLayout from "./layouts/Onboarding/OnboardingLayout";
import History from "./pages/History";
import Home from "./pages/Home";
import Rates from "./pages/Rates";

import Settings from "./pages/Settings";
import SupportChat from "./pages/SupportChat";

// const CLIENT_ID =""

function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <Routes>

        <Route element={<OnboardingLayout />}>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pin" element={<Pin />} />
        </Route>

        <Route element={<HomeLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/rates" element={<Rates />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route element={<ChatLayout />}>
          <Route path="/support" element={<SupportChat />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
