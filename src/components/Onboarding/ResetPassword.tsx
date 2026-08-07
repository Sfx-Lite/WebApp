import type { SubmitHandler } from "react-hook-form";
import type { ResetPasswordFormData } from "@/lib/schemas/forgot-password";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ArrowLeft, Check, XCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router";
import { useResetPasswordMutation } from "@/api/auth";
import { resetPasswordSchema } from "@/lib/schemas/forgot-password";
import appstoreIcon from "../../assets/icons/appstore.png";
import playstoreIcon from "../../assets/icons/google-play.png";
import sfxbarcode from "../../assets/imgs/sfx-barcode.svg";
import heroImage from "../../assets/imgs/sfx-hero.webp";
import FormInput from "../Form/FormInput";

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const [isDone, setIsDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<ResetPasswordFormData> = async (data) => {
    if (!token) {
      setErrorMessage("This reset link is missing its token. Please request a new one.");
      return;
    }

    setErrorMessage(null);
    try {
      await resetPassword({ token, newPassword: data.newPassword }).unwrap();
      setIsDone(true);
    }
    catch (error) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      const message = status === 401
        ? "This reset link is invalid or has expired. Please request a new one."
        : axios.isAxiosError<{ message: string }>(error)
          ? error.response?.data?.message
          : "Something went wrong. Please try again.";
      setErrorMessage(message ?? "Something went wrong. Please try again.");
    }
  };

  if (!token) {
    return (
      <section className="flex md:gap-[0rem] lg:gap-[10rem] pb-[3rem]">
        <div className="w-full md:w-[50%] lg:w-[40%]">
          <div className="flex flex-col items-center text-center space-y-4 py-[2rem]">
            <div className="flex size-14 items-center justify-center rounded-full bg-sfx-danger-bg">
              <XCircle className="size-6 text-sfx-danger" />
            </div>
            <div>
              <h1 className="text-[1.5rem] font-rh-sb">Invalid reset link</h1>
              <p className="text-[1rem] text-sfx-muted mt-1">
                This link is missing or malformed. Please request a new password reset.
              </p>
            </div>
            <Link
              to="/forgot-password"
              className="text-sfx-primary font-rh-sb text-[15px] underline"
            >
              Request a new link
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex md:gap-[0rem] lg:gap-[10rem] pb-[3rem]">
      <div className="w-full md:w-[50%] lg:w-[40%]">
        <div className="space-y-[2.25rem]">
          {isDone
            ? (
                <div className="flex flex-col items-center text-center space-y-4 py-[2rem]">
                  <div className="flex size-14 items-center justify-center rounded-full bg-sfx-success-bg">
                    <Check className="size-6 text-sfx-success" />
                  </div>
                  <div>
                    <h1 className="text-[1.5rem] font-rh-sb">Password reset</h1>
                    <p className="text-[1rem] text-sfx-muted mt-1">
                      Your password has been changed. You can now log in with your new password.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full py-4 px-3 rounded-full bg-sfx-primary text-white font-rh-b
                               hover:scale-95 transition-transform duration-300"
                  >
                    Back to login
                  </button>
                </div>
              )
            : (
                <>
                  <div>
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      aria-label="Go back"
                      className="mb-4 text-sfx-ink hover:text-sfx-primary transition-colors"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-[1.5rem] font-rh-sb">
                      Create your password
                    </h1>
                    <p className="text-[1rem] text-sfx-muted">
                      Create a secure password to protect your account and keep your password safe
                    </p>
                  </div>

                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    aria-busy={isLoading}
                    className="space-y-[2.25rem]"
                  >
                    <fieldset disabled={isLoading} className="space-y-4">
                      <FormInput
                        label="New password"
                        type="password"
                        placeholder="New password"
                        {...register("newPassword")}
                        error={errors.newPassword?.message}
                      />
                      <FormInput
                        label="Confirm password"
                        type="password"
                        placeholder="Confirm password"
                        {...register("confirmPassword")}
                        error={errors.confirmPassword?.message}
                      />
                    </fieldset>

                    {errorMessage && (
                      <p className="text-sm text-sfx-danger">{errorMessage}</p>
                    )}

                    <div className="space-y-3.5">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 px-3 rounded-full bg-sfx-primary text-white font-rh-b
                                   hover:scale-95 transition-transform duration-300
                                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                                   flex items-center justify-center gap-2"
                      >
                        {isLoading && (
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        )}
                        {isLoading ? "Saving..." : "Continue"}
                      </button>

                      <div className="text-center">
                        <span className="inline-block">
                          Remember password?
                        </span>
                        {" "}
                        <Link
                          to="/login"
                          className="text-sfx-primary font-rh-sb text-[15px] underline"
                        >
                          Login
                        </Link>
                      </div>
                    </div>
                  </form>
                </>
              )}
        </div>
      </div>

      <div className="hidden md:block w-1/2">
        <div className="relative flex justify-center">
          <div className="w-[29rem]">
            <img
              src={heroImage}
              alt="SFx app illustration"
              className="w-full object-cover"
            />
          </div>

          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-sfx-card md:w-[80%] lg:w-[70%] py-4 px-6 rounded-[1rem]">
            <div className="flex gap-4">
              <div className="shrink-0 w-[4rem]">
                <img
                  src={sfxbarcode}
                  alt="SFx app illustration"
                  className="w-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <div className="w-7">
                    <img
                      src={appstoreIcon}
                      alt="SFx app illustration"
                      className="w-full object-cover"
                    />
                  </div>
                  <div className="w-7">
                    <img
                      src={playstoreIcon}
                      alt="SFx app illustration"
                      className="w-full object-cover"
                    />
                  </div>
                </div>
                <p className="text-[14px] font-rh-m leading-[14px]">
                  Scan the QR code to download the SFx App
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
