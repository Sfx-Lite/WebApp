import { Route, Routes } from "react-router";
import ChatLayout from "../../layouts/Chat/ChatLayout";
import HomeLayout from "../../layouts/Home/HomeLayout";
import OnboardingLayout from "../../layouts/Onboarding/OnboardingLayout";
import History from "../../pages/History";

import Home from "../../pages/Home";
import Rates from "../../pages/Rates";
import Settings from "../../pages/Settings";
import SupportChat from "../../pages/SupportChat";
import KycDocCapture from "../Home/Kyc/KycDocCapture";

import KycIntro from "../Home/Kyc/KycIntro";
import KycPending from "../Home/Kyc/KycPending";
import KycReviewSubmit from "../Home/Kyc/KycReviewSubmit";
import KycSelfieCapture from "../Home/Kyc/KycSelfieCapture";
import KycType from "../Home/Kyc/KycType";
import UserProfile from "../Home/UserProfile";
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

          <Route path="/kyc" element={<KycIntro />} />
          <Route path="/kyc/type" element={<KycType />} />
          <Route path="/kyc/doc" element={<KycDocCapture />} />
          <Route path="/kyc/selfie" element={<KycSelfieCapture />} />
          <Route path="/kyc/submit" element={<KycReviewSubmit />} />
          <Route path="/kyc/pending" element={<KycPending />} />

          <Route path="/profile" element={<UserProfile />} />
        </Route>

        <Route element={<ChatLayout />}>
          <Route path="/support" element={<SupportChat />} />
        </Route>
      </Route>
    </Routes>
  );
}
