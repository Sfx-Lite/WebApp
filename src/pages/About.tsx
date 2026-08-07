import {
  Building2,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  Globe,
  MessageCircleQuestion,
} from "lucide-react";
import { useState } from "react";

import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router";
import logo from "../assets/imgs/sfx-logo-white.png";

type ItemProps = {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
};

function AboutItem({ title, icon, children }: ItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-card bg-sfx-card shadow-brand">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-4"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-sfx-primary-tint p-2 text-sfx-primary">
            {icon}
          </div>

          <span className="font-rh-m text-sfx-ink">{title}</span>
        </div>

        {open
          ? (
              <ChevronUp className="text-sfx-muted" size={18} />
            )
          : (
              <ChevronDown className="text-sfx-muted" size={18} />
            )}
      </button>

      {open && (
        <div className="border-t border-sfx-primary-tint px-4 py-4 text-sm leading-6 text-sfx-muted">
          {children}
        </div>
      )}
    </div>
  );
}

const CURRENT_YEAR = new Date().getFullYear();

export default function About() {
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-xl space-y-5 md:px-screen-x">
      <header className="mb-8 flex items-center gap-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/settings")}
            className="p-[10px] rounded-full bg-sfx-card"
          >
            <MdArrowBack className="text-[20px]" />
          </button>
          <span className="inline-block font-rh-m">
            About SFx Money
          </span>
        </div>
      </header>

      <div className="rounded-xl bg-sfx-primary p-6 text-center text-white shadow-brand">
        <div className="mx-auto mb-8 flex items-center justify-center">
          <img src={logo} alt="SFx Money logo" className="w-30" />
        </div>
        <p className="mt-2 text-sm opacity-90">
          Secure, simple and borderless financial services.
        </p>

        <p className="mt-4 text-xs opacity-75">Version 1.0.0</p>
      </div>

      <AboutItem title="Who We Are" icon={<Building2 size={18} />}>
        <p>
          SFx Money helps you send, receive and manage money globally through
          digital wallets, virtual accounts and secure payment solutions.
        </p>
      </AboutItem>

      <AboutItem title="Our Services" icon={<Globe size={18} />}>
        <ul className="list-disc space-y-1 pl-5">
          <li>Multi-currency wallets</li>
          <li>Virtual accounts</li>
          <li>International transfers</li>
          <li>Virtual cards</li>
        </ul>
      </AboutItem>

      <AboutItem
        title="Frequently Asked Questions"
        icon={<MessageCircleQuestion size={18} />}
      >
        <div className="space-y-4">
          <div>
            <p className="font-rh-m text-sfx-ink">
              How do I verify my account?
            </p>

            <p>
              Complete the KYC verification process by submitting your
              identification documents through the app.
            </p>
          </div>

          <div>
            <p className="font-rh-m text-sfx-ink">
              How long do transfers take?
            </p>

            <p>
              Transfer times depend on the destination and payment method. Most
              transactions are processed as quickly as possible.
            </p>
          </div>

          <div>
            <p className="font-rh-m text-sfx-ink">
              Can I hold multiple currencies?
            </p>

            <p>
              Yes. SFx Money allows you to manage multiple currencies within
              your wallet.
            </p>
          </div>
        </div>
      </AboutItem>

      <AboutItem title="Need Help?" icon={<CircleHelp size={18} />}>
        <p>
          Visit the FAQ or Contact Us section if you need assistance. Our
          support team is ready to help with your account, transfers and
          payments.
        </p>
      </AboutItem>

      {/* Footer */}
      <p className="pt-2 text-center text-xs text-sfx-muted">
        ©
        {CURRENT_YEAR}
        {" "}
        SFx Money
      </p>
    </div>
  );
}
