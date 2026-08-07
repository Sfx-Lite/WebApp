import type { SubmitHandler } from "react-hook-form";
import type { ForgotPasswordFormData } from "@/lib/schemas/forgot-password";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ArrowLeft, MailCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { useRequestPasswordResetMutation } from "@/api/auth";
import { forgotPasswordSchema } from "@/lib/schemas/forgot-password";
import appstoreIcon from "../../assets/icons/appstore.png";
import playstoreIcon from "../../assets/icons/google-play.png";
import sfxbarcode from "../../assets/imgs/sfx-barcode.svg";
import heroImage from "../../assets/imgs/sfx-hero.webp";
import FormInput from "../Form/FormInput";

type ForgotPasswordProps = {
  onBack?: () => void;
};

export default function ForgotPassword({ onBack }: ForgotPasswordProps) {
  const [requestReset, { isLoading }] = useRequestPasswordResetMutation();
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormData> = async (data) => {
    setErrorMessage(null);
    try {
      await requestReset({ email: data.email }).unwrap();
      setSubmittedEmail(data.email);
    }
    catch (error) {
      const message = axios.isAxiosError<{ message: string }>(error)
        ? error.response?.data?.message
        : "Something went wrong. Please try again.";
      setErrorMessage(message ?? "Something went wrong. Please try again.");
    }
  };

  return (
    <section className="flex md:gap-[0rem] lg:gap-[10rem] pb-[3rem]">
      <div className="w-full md:w-[50%] lg:w-[40%]">
        <div className="space-y-[2.25rem]">
          {submittedEmail
            ? (
                <div className="space-y-[2.25rem]">
                  {onBack && (
                    <button
                      type="button"
                      onClick={onBack}
                      aria-label="Go back"
                      className="text-sfx-ink hover:text-sfx-primary transition-colors"
                    >
                      <ArrowLeft size={20} />
                    </button>
                  )}

                  <div className="flex flex-col items-center text-center space-y-4 py-[1rem]">
                    <div className="flex size-14 items-center justify-center rounded-full bg-sfx-primary-tint">
                      <MailCheck className="size-6 text-sfx-primary" />
                    </div>
                    <div>
                      <h1 className="text-[1.5rem] font-rh-sb">Check your email</h1>
                      <p className="text-[1rem] text-sfx-muted mt-1">
                        If an account exists for
                        {" "}
                        <span className="font-rh-sb text-sfx-ink">{submittedEmail}</span>
                        , we've sent a link to reset your password. The link expires in 60 minutes.
                      </p>
                    </div>
                  </div>

                  <div className="text-center">
                    <span className="inline-block">Didn't get it?</span>
                    {" "}
                    <button
                      type="button"
                      onClick={() => setSubmittedEmail(null)}
                      className="text-sfx-primary font-rh-sb text-[15px] underline"
                    >
                      Try another email
                    </button>
                  </div>
                </div>
              )
            : (
                <>
                  <div>
                    {onBack && (
                      <button
                        type="button"
                        onClick={onBack}
                        aria-label="Go back"
                        className="mb-4 text-sfx-ink hover:text-sfx-primary transition-colors"
                      >
                        <ArrowLeft size={20} />
                      </button>
                    )}
                    <h1 className="text-[1.5rem] font-rh-sb">
                      Forgot password
                    </h1>
                    <p className="text-[1rem] text-sfx-muted">
                      We'll send a password reset link to this email
                    </p>
                  </div>

                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    aria-busy={isLoading}
                    className="space-y-[2.25rem]"
                  >
                    <fieldset disabled={isLoading} className="space-y-4">
                      <FormInput
                        label="Email"
                        type="email"
                        placeholder="sample@gmail.com"
                        {...register("email")}
                        error={errors.email?.message}
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
                        {isLoading ? "Sending..." : "Continue"}
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
