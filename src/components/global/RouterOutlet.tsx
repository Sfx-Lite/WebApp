import { Route, Routes } from "react-router";
import DashboardLayout from "@/layouts/Dashboard/DashboardLayout";
import AddMoney from "@/pages/AddMoney";
import DepositAddress from "@/pages/DepositAddress";

import DepositCrypto from "@/pages/DepositCrypto";
import Notifications from "@/pages/Notifications";
import ReceiveFromSFx from "@/pages/ReceiveFromSfx";
import ChatLayout from "../../layouts/Chat/ChatLayout";
import OnboardingLayout from "../../layouts/Onboarding/OnboardingLayout";
import History from "../../pages/History";

import Home from "../../pages/Home";
import Rates from "../../pages/Rates";
import Settings from "../../pages/Settings";
import SupportChat from "../../pages/SupportChat";
import KycDocCapture from "../Kyc/KycDocCapture";
import KycIntro from "../Kyc/KycIntro";

import KycPending from "../Kyc/KycPending";
import KycReviewSubmit from "../Kyc/KycReviewSubmit";
import KycSelfieCapture from "../Kyc/KycSelfieCapture";
import KycStatus from "../Kyc/KycStatus";
import KycType from "../Kyc/KycType";
import LoginFlow from "../Onboarding/LoginFlow";
import AuthFlow from "../Onboarding/RegistrationFlow";
import UserPassword from "../UserPassword";
import UserProfile from "../UserProfile";
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
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/rates" element={<Rates />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/addmoney" element={<AddMoney />} />
          <Route path="/addmoney/sfxr" element={<ReceiveFromSFx />} />
          <Route path="/addmoney/depositcrypto" element={<DepositCrypto />} />
          <Route path="/addmoney/depositaddress" element={<DepositAddress />} />

          <Route path="/kyc" element={<KycIntro />} />
          <Route path="/kyc/type" element={<KycType />} />
          <Route path="/kyc/doc" element={<KycDocCapture />} />
          <Route path="/kyc/selfie" element={<KycSelfieCapture />} />
          <Route path="/kyc/submit" element={<KycReviewSubmit />} />
          <Route path="/kyc/pending" element={<KycPending />} />
          <Route path="/kyc/status" element={<KycStatus />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/password" element={<UserPassword />} />
        </Route>

        <Route element={<ChatLayout />}>
          <Route path="/support" element={<SupportChat />} />
        </Route>
      </Route>
    </Routes>
  );
}
