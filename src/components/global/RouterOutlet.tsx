import { Route, Routes } from "react-router";
import ChatLayout from "../../layouts/Chat/ChatLayout";
import HomeLayout from "../../layouts/Home/HomeLayout";
import OnboardingLayout from "../../layouts/Onboarding/OnboardingLayout";
import History from "../../pages/History";

import Home from "../../pages/Home";
import Rates from "../../pages/Rates";
import Settings from "../../pages/Settings";
import SupportChat from "../../pages/SupportChat";
import LoginFlow from "../Onboarding/LoginFlow";

import AuthFlow from "../Onboarding/RegistrationFlow";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

export default function RouterOutlet() {
  return (
    <Routes>

      <Route element={<PublicRoute />}>
        <Route element={<OnboardingLayout />}>
          <Route path="/login" element={<LoginFlow />} />
          <Route path="/register" element={<AuthFlow />} />
        </Route>
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
