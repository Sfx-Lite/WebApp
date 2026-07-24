import { useState } from "react";
import {
  MdArrowBack,
  MdCheck,
  MdClose,
  MdLock,
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
  MdSave,
} from "react-icons/md";
import { Link } from "react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type PasswordInputProps = {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
};

function PasswordInput({
  label,
  value,
  onChange,
  placeholder = "*********************",
  error,
  disabled = false,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="mb-2 block font-rh-sb text-sm text-sfx-muted">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          disabled={disabled}
          onChange={e => onChange?.(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-xl border bg-white px-4 py-3 pr-12 font-rh-sb text-sfx-ink outline-none transition-colors focus:border-sfx-primary ${
            error ? "border-red-500" : "border-sfx-ink/20"
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(prev => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sfx-muted hover:text-sfx-ink focus:outline-none"
          tabIndex={-1}
        >
          {showPassword
            ? (
                <MdOutlineVisibilityOff className="size-5" />
              )
            : (
                <MdOutlineVisibility className="size-5" />
              )}
        </button>
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-sfx-danger font-rh-sb">{error}</p>
      )}
    </div>
  );
}

export default function UserPassword() {
  const [currentPassword, setCurrentPassword] = useState("YourCurrentPassword123!");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const requirements = [
    { id: "req-length", label: "At least 8 characters long", test: (p: string) => p.length >= 8 },
    {
      id: "req-uppercase",
      label: "Contains at least 1 uppercase letter",
      test: (p: string) => /[A-Z]/.test(p),
    },
    {
      id: "req-number",
      label: "Contains at least 1 number",
      test: (p: string) => /\d/.test(p),
    },
    {
      id: "req-special",
      label: "Contains at least 1 special character",
      test: (p: string) => /[^A-Z0-9]/i.test(p),
    },
  ];

  const passedRequirements = requirements.filter(r =>
    r.test(newPassword),
  ).length;

  const getStrengthLabel = () => {
    if (newPassword.length === 0)
      return { text: "", color: "bg-gray-200" };
    if (passedRequirements <= 1)
      return { text: "Weak", color: "bg-red-500" };
    if (passedRequirements <= 3)
      return { text: "Medium", color: "bg-amber-500" };
    return { text: "Strong", color: "bg-sfx-success" };
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!currentPassword) {
      toast.error ("Please enter your current password.");
      return;
    }

    if (passedRequirements < requirements.length) {
      toast.error(
        "Please ensure your new password meets all security requirements.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }

    toast.success(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const strength = getStrengthLabel();

  return (
    <div className="flex min-h-dvh w-full flex-col bg-sfx-primary-tint overflow-y-auto">
      <div className="mx-auto flex w-full max-w-4xl lg:max-w-5xl flex-1 flex-col p-4 sm:p-6 lg:p-8">
        <header className="mb-8 flex items-center gap-2">
          <Link
            to="/settings"
            className="rounded-lg p-1 transition-colors hover:bg-sfx-primary/10"
          >
            <MdArrowBack className="size-6 text-sfx-ink" />
          </Link>

          <h1 className="font-rh-sb text-lg text-sfx-ink sm:text-xl">
            Password
          </h1>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <section className="rounded-2xl border border-sfx-ink/20 bg-white p-6 shadow-brand h-fit">
            <div className="flex flex-col items-center text-center">
              <div className="flex size-20 items-center justify-center rounded-full bg-sfx-primary/10">
                <MdLock className="size-10 text-sfx-primary" />
              </div>

              <h2 className="mt-4 font-rh-b text-xl text-sfx-ink">
                Password Settings
              </h2>

              <p className="mt-2 text-xs leading-relaxed text-sfx-muted">
                Keep your account secure by using a unique password that you do
                not use anywhere else.
              </p>
            </div>
          </section>

          <div className="space-y-6 lg:col-span-3">
            <form onSubmit={handlePasswordChange}>
              <section className="rounded-2xl border border-sfx-ink/20 bg-white p-6 shadow-brand">
                <h2 className="font-rh-b text-lg text-sfx-ink">
                  Change Password
                </h2>

                <p className="mt-1 text-sm text-sfx-muted">
                  Update your account password below.
                </p>

                {success && (
                  <div className="mt-6 flex items-center gap-2 rounded-xl border border-sfx-success bg-sfx-success p-4 text-sm font-rh-sb text-sfx-success">
                    <MdCheck className="size-5 text-sfx-success shrink-0" />
                    Your password has been updated successfully!
                  </div>
                )}

                {error && (
                  <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-rh-sb text-sfx-danger">
                    <MdClose className="size-5 text-sfx-danger shrink-0" />
                    {error}
                  </div>
                )}

                <div className="mt-8 space-y-6">
                  <PasswordInput
                    label="Current Password"
                    value={currentPassword}
                    disabled={true}
                  />

                  <hr className="border-sfx-ink/10" />

                  <div className="space-y-4">
                    <PasswordInput
                      label="New Password"
                      value={newPassword}
                      onChange={setNewPassword}
                      placeholder="Enter new password"
                    />

                    {newPassword.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-rh-sb">
                          <span className="text-sfx-muted">Strength:</span>
                          <span className="text-sfx-ink">{strength.text}</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-sfx-ink/10 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${strength.color}`}
                            style={{
                              width: `${(passedRequirements / 4) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="rounded-xl border border-sfx-ink/10 bg-sfx-primary-tint/20 p-4">
                      <p className="mb-3 text-xs font-rh-sb text-sfx-ink">
                        Password Requirements:
                      </p>
                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        {requirements.map((req) => {
                          const isMet = req.test(newPassword);
                          return (
                            <div
                              key={req.id}
                              className="flex items-center gap-2 text-xs"
                            >
                              <div
                                className={`flex size-4 items-center justify-center rounded-full ${
                                  isMet
                                    ? "bg-sfx-success text-white"
                                    : "bg-sfx-ink/10 text-sfx-muted"
                                }`}
                              >
                                {isMet
                                  ? (
                                      <MdCheck className="size-3" />
                                    )
                                  : (
                                      <span className="size-1 rounded-full bg-sfx-muted" />
                                    )}
                              </div>
                              <span
                                className={
                                  isMet
                                    ? "font-rh-sb text-sfx-ink"
                                    : "text-sfx-muted"
                                }
                              >
                                {req.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <PasswordInput
                    label="Confirm New Password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    placeholder="Re-enter new password"
                  />
                </div>

                <Button
                  type="submit"
                  className="mt-8 h-button-h w-full rounded-button bg-sfx-primary font-rh-sb text-white shadow-brand hover:bg-sfx-ink/90  flex items-center justify-center gap-2"
                >
                  <MdSave className="size-5" />
                  Update Password
                </Button>
              </section>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
