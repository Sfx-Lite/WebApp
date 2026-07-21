import { Outlet } from "react-router";
import OnboardingNav from "../../components/Onboarding/OnboardingNav";

export default function OnboardingLayout() {
  return (
    <div
      className="min-h-dvh w-full bg-gradient-to-b from-[var(--color-sfx-primary-soft)] from-0% via-[#f3edff] via-22% to-white to-100%"
    >
      <div className="w-full px-5 md:max-w-[95%] lg:max-w-[83%] w-full pt-6 mx-auto h-full">
        <div className="mb-[4rem]">
          <OnboardingNav />
        </div>

        <Outlet />
      </div>
    </div>
  );
}
