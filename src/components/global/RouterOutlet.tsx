import { Route, Routes } from "react-router";
import ChatLayout from "@/layouts/Chat/ChatLayout";
import HomeLayout from "@/layouts/Home/HomeLayout";
import OnboardingLayout from "@/layouts/Onboarding/OnboardingLayout";
import History from "@/pages/History";

import Home from "@/pages/Home";
import Rates from "@/pages/Rates";
import Settings from "@/pages/Settings";
import SupportChat from "@/pages/SupportChat";
import Login from "../Onboarding/Login";
import Pin from "../Onboarding/Pin";
import Register from "../Onboarding/Register";
import Welcome from "../Onboarding/Welcome";

import PinRoute from "./PinRoute";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

export default function RouterOutlet() {
  return (
    <Routes>

      <Route element={<PublicRoute />}>
        <Route element={<OnboardingLayout />}>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Route>

      <Route element={<PinRoute />}>
        <Route path="/pin" element={<Pin />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<HomeLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/rates" element={<Rates />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route element={<ChatLayout />}>
          <Route path="/support" element={<SupportChat />} />
        </Route>
      </Route>
    </Routes>
  );
}
