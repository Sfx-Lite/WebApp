import { Route, Routes } from "react-router";
import DashboardLayout from "@/layouts/Dashboard/DashboardLayout";
import About from "@/pages/About";
import AddMoney from "@/pages/AddMoney";
import Amount from "@/pages/Amount";

import DepositAddress from "@/pages/DepositAddress";
import DepositCrypto from "@/pages/DepositCrypto";
import Notifications from "@/pages/Notifications";
import ReceiveFromSFx from "@/pages/ReceiveFromSfx";
import ReviewTransfer from "@/pages/ReviewTransfer";

import SendMoney from "@/pages/SendMoney";
import SendToSfx from "@/pages/SendToSfx";
import SuccessTransfer from "@/pages/SuccessTransfer";
import OnboardingLayout from "../../layouts/Onboarding/OnboardingLayout";
import History from "../../pages/History";
import Home from "../../pages/Home";

import Rates from "../../pages/Rates";
import Settings from "../../pages/Settings";
import SupportChat from "../../pages/SupportChat";
import KycDocCapture from "../Kyc/KycDocCapture";
import KycGate from "../Kyc/KycGate";
import KycIntro from "../Kyc/KycIntro";
import KycReviewSubmit from "../Kyc/KycReviewSubmit";
import KycSelfieCapture from "../Kyc/KycSelfieCapture";
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
          <Route path="/sendmoney" element={<SendMoney />} />
          <Route path="/sendmoney/sfxs" element={<SendToSfx />} />
          <Route path="/sendmoney/sfxs/amount" element={<Amount />} />
          <Route path="/sendmoney/sfxs/review" element={<ReviewTransfer />} />
          <Route path="/sendmoney/sfxs/success" element={<SuccessTransfer />} />

          <Route path="/kyc" element={<KycIntro />} />
          <Route path="/kyc/type" element={<KycType />} />
          <Route path="/kyc/doc" element={<KycDocCapture />} />
          <Route path="/kyc/selfie" element={<KycSelfieCapture />} />
          <Route path="/kyc/submit" element={<KycReviewSubmit />} />
          <Route path="/kyc/status" element={<KycGate />} />

          <Route path="/profile" element={<UserProfile />} />
          <Route path="/password" element={<UserPassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<SupportChat />} />
        </Route>

        {/* <Route element={<ChatLayout />}>
        </Route> */}
      </Route>
    </Routes>
  );
}
