import type { SubmitHandler } from "react-hook-form";
import type { LoginFormData } from "../../lib/schemas/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { toast } from "sonner";
import api from "../../api/axios";
import appstoreIcon from "../../assets/icons/appstore.png";
import playstoreIcon from "../../assets/icons/google-play.png";
import sfxbarcode from "../../assets/imgs/sfx-barcode.svg";
import heroImage from "../../assets/imgs/sfx-hero.webp";

import { useAppDispatch } from "../../hooks/reduxHooks";
import { loginSchema } from "../../lib/schemas/schema";
import { credentialsSet } from "../../store/authSlice";
import FormInput from "../Form/FormInput";
import GoogleAuth from "./GoogleAuth";

const LOGIN_URL = "/auth/login";

type LoginProps = {
  onSuccess: (isPin: boolean) => void;
  onGoogleSuccess: (isNewUser: boolean) => void;
};

export default function Login({ onSuccess, onGoogleSuccess }: LoginProps) {
  const dispatch = useAppDispatch();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setIsSubmitting(true);

    try {
      const response = await api.post(LOGIN_URL, {
        emailOrUsername: data.identifier,
        password: data.password,
      });

      const { accessToken, refreshToken, user, isPin } = response.data?.data ?? {};

      if (accessToken && refreshToken && user) {
        dispatch(credentialsSet({ accessToken, refreshToken, user }));
        toast.success("Logged in successfully!");
        onSuccess(Boolean(isPin));
      }
      else {
        toast.error("Authentication data not found in server response.");
      }
    }
    catch (error) {
      const message = axios.isAxiosError<{ message: string }>(error)
        ? error.response?.data?.message
        : "Something went wrong with login.";

      toast.error(message ?? "Login failed");
    }
    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="flex  md:gap-[0rem] lg:gap-[10rem] pb-[3rem]"
    >
      <div className="w-full md:w-[50%] lg:w-[40%]">
        <div className="space-y-[2.25rem]">
          <div>
            <h1 className="text-[1.5rem] font-rh-sb">
              Login to your account
            </h1>
            <p className="text-[1rem] text-sfx-muted">
              Enter your login details below
            </p>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            aria-busy={isSubmitting}
            className="space-y-[2.25rem]"
          >
            <fieldset disabled={isSubmitting} className="space-y-4">
              <FormInput
                label="Email or Username"
                type="email"
                placeholder="Sample@gmail.com"
                {...register("identifier")}
                error={errors.identifier?.message}
              />
              <FormInput
                label="Password"
                type="password"
                placeholder="*********"
                {...register("password")}
                error={errors.password?.message}
              />
              <Link
                to="/"
                className="text-sfx-primary font-rh-sb text-[15px] underline"
              >
                Forgot password?
              </Link>
            </fieldset>

            <div className="space-y-3.5">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-3 rounded-full bg-sfx-primary text-white font-rh-b
                           hover:scale-95 transition-transform duration-300
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                           flex items-center justify-center gap-2"
              >
                {isSubmitting && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {isSubmitting ? "Logging in..." : "Login"}
              </button>

              <div className="flex gap-2 items-center">
                <div className="flex-1 h-0.5 bg-sfx-muted/40" />
                <span className="inline-block uppercase text-[14px]">or</span>
                <div className="flex-1 h-0.5 bg-sfx-muted/40" />
              </div>

              <GoogleAuth onSuccess={onGoogleSuccess} />

              <div className="text-center">
                <span className="inline-block">
                  Dont have an account?
                </span>
                {" "}
                <Link
                  to="/register"
                  className="text-sfx-primary font-rh-sb text-[15px] underline"
                >
                  Sign up
                </Link>
              </div>
            </div>

          </form>
        </div>
      </div>
      <div className="hidden md:block w-1/2">
        <div className="relative flex justify-center">
          <div className=" w-[29rem]">
            <img
              src={heroImage}
              alt="SFx app illustration"
              className="w-full object-cover"
            />
          </div>

          <div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-sfx-card md:w-[80%] lg:w-[70%] py-4 px-6 rounded-[1rem]"
          >
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
