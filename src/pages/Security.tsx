import { ChevronRight, KeyRound, Lock, Shield } from "lucide-react";
import { MdArrowBack } from "react-icons/md";
import { Link } from "react-router";

type SecurityItemProps = {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  to?: string;
  rightElement?: React.ReactNode;
};

function SecurityItem({
  title,
  subtitle,
  icon,
  to,
  rightElement,
}: SecurityItemProps) {
  const content = (
    <div className="rounded-card bg-sfx-card shadow-brand transition-shadow mb-4 hover:shadow-brand/10">
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3 ">
          <div className="rounded-full bg-sfx-primary-tint p-2 text-sfx-primary">
            {icon}
          </div>

          <div>
            <p className="font-rh-m text-sfx-ink">{title}</p>

            <p className="mt-1 text-xs text-sfx-muted">{subtitle}</p>
          </div>
        </div>

        <div className="shrink-0">
          {rightElement ?? (
            <ChevronRight size={18} className="text-sfx-muted" />
          )}
        </div>
      </div>
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }

  return content;
}

export default function SecurityOptions() {
  return (
    <div className="mx-auto max-w-xl space-y-5 px-screen-x py-6">
      <header className="mb-8 flex items-center gap-2">
        <Link
          to="/settings"
          className="rounded-lg p-1 transition-colors hover:bg-sfx-primary/10"
        >
          <MdArrowBack className="size-6 text-sfx-ink" />
        </Link>

        <h1 className="font-rh-sb text-lg text-sfx-ink sm:text-xl">Security</h1>
      </header>

      <div className="rounded-xl bg-sfx-primary p-6 text-center text-white shadow-brand">
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-white/15">
          <Shield size={34} />
        </div>

        <h2 className="font-rh-sb text-2xl">Security Options</h2>

        <p className="mt-2 text-sm opacity-90">
          Protect your account by managing your password or transaction PIN.
        </p>
      </div>

      {/* Options */}
      <div className="space-y-4">
        <SecurityItem
          title="Manage Password"
          subtitle="Update your account password."
          icon={<Lock size={18} />}
          to="/password"
        />

        <SecurityItem
          title="Transaction PIN"
          subtitle="Change your 4-digit transaction PIN."
          icon={<KeyRound size={18} />}
          to="/change-pin"
        />
      </div>
    </div>
  );
}
